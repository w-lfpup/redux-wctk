import "./datastore.js";
import { ShapeControls } from "./components/shape-controls.js";
import { ShapeTable } from "./components/shape-table.js";
import { ShapeList } from "./components/shape-list.js";
customElements.define("shape-controls", ShapeControls);
customElements.define("shape-table", ShapeTable);
customElements.define("shape-list", ShapeList);
