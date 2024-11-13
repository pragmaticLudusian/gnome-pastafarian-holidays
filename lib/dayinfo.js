import {
  PopupMenuItem,
  PopupMenuSection,
} from "resource:///org/gnome/shell/ui/popupMenu.js";

export class DayInfo extends PopupMenuSection {
  title;

  description;

  urlToOpen = null;

  get allItems() {
    return [this.title, this.description];
  }

  constructor() {
    super();
    this.title = new PopupMenuItem("");
    this.description = new PopupMenuItem("");

    // Make the title stand out
    this.title.style = "font-weight: 700; font-size: 12pt;";
    this.title.connect("activate", () => {
      if (this.urlToOpen !== null) {
        Gio.app_info_launch_default_for_uri(
          this.urlToOpen,
          global.create_app_launch_context(0, -1)
        );
      }
    });

    this.description.style = "max-width: 400px";
    this.description.label.clutterText.lineWrap = true;
    for (const item of this.allItems) {
      item.set_reactive(false);
      // Don't dim text, but let's still not click on these elements
      item.remove_style_pseudo_class("insensitive");
      this.addMenuItem(item);
    }
    this.unset();
  }

  unset() {
    this.urlToOpen = null;
    for (const item of this.allItems) {
      item.label.text = "";
      item.visible = false;
    }
  }

  setData(title, description, url) {
    this.urlToOpen = url;
    for (const item of this.allItems) {
      item.visible = true;
    }
    this.title.label.set_text(title.trim());
    if (this.urlToOpen) {
      this.title.reactive = true;
    } else {
      this.title.reactive = false;
      this.title.remove_style_pseudo_class("insensitive");
    }
    if (description) {
      this.description.label.text = description.trim();
      this.description.label.visible = true;
    } else {
      this.description.label.text = "";
      this.description.visible = false;
    }
  }
}
