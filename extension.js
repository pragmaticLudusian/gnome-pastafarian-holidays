/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";

import {
  Extension,
  gettext as _,
} from "resource:///org/gnome/shell/extensions/extension.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { DayInfo } from "./lib/dayinfo.js";
import { getHoliday } from "./lib/utils.js";

let updateDayFunc = null; // global interval

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(1, _("Pastafarian Holidays")); // note: doesn't relocate upon auto-updating label

      let today = getHoliday();
      updateDayFunc = setInterval(updateDay, 1000);

      const label = new St.Label({
        text: today.title,
        style_class: "pasta-today-label",
        y_expand: true,
        y_align: Clutter.ActorAlign.CENTER,
      });
      this.add_child(label);

      const dayInfo = new DayInfo();
      dayInfo.setData(today.title, today.description);
      this.menu.addMenuItem(dayInfo);

      function updateDay() {
        today = getHoliday();
        label.text = today.title;
        dayInfo.setData(today.title, today.description);
      }
    }
  }
);

export default class PastafarianHolidayExtension extends Extension {
  enable() {
    this._indicator = new Indicator();
    Main.panel.addToStatusArea(this.uuid, this._indicator, -1, "left");
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
    clearInterval(updateDayFunc); // prevent updating non-existent resource upon reloading
  }
}
