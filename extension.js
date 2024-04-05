/**
 Copyright 2012 Sebastian Ventura
 Copyright 2012 Meng Zhuo
 Copyright 2015 Mario Sanchez Prada
 Copyright 2024 Grigory Stupnikov
 This file is part of Remove Accessibility.

 Remove Accessibility is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Foobar is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Remove Accessibility.  If not, see <http://www.gnu.org/licenses/>.
**/
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class A11yStatusIconHelper extends Extension {
   constructor(metadata) {
      super(metadata);
   }

   _onIconVisibilityChanged(actor) {
      if (actor.is_visible()) {
         actor.hide();
      }
   }

   hideA11yElement() {
      // Monitor changes to the icon's visibilty, so that we
      // ensure the icon always keeps hidden, no-matter-what.
      this._handlerId = this._iconActor.connect('notify::visible',
         this._onIconVisibilityChanged.bind(this));
      this._iconActor.hide();
   }

   restoreA11yElement() {
      if (this._handlerId) {
         this._iconActor.disconnect(this._handlerId);
         this._handlerId = 0;
      }
      this._iconActor.show();
   }

   enable() {
      // Get a reference to the right accessibility icon.
      let a11yElement = null;
      if (typeof Main.panel._statusArea === 'undefined') {
         a11yElement = Main.panel.statusArea.a11y;
      } else {
         a11yElement = Main.panel._statusArea.a11y;
      }

      // The ClutterActor representing the icon in the panel.
      this._iconActor = a11yElement.actor;

      // Id for the handler used to connect to GSetting's signals.
      this._handlerId = 0;
      this.hideA11yElement();
   }

   disable() {
      this.restoreA11yElement();
   }
};
