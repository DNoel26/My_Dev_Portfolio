/*require("./js/app.js");
require("./js/UI_Logic/UI.js");
require("./js/Business_Logic/API.js");
require("./js/Business_Logic/Formspree.js");
require("./js/Business_Logic/Functions.js");
require("./js/Business_Logic/Project.js");
require("./js/Business_Logic/SkillRating.js");
require("./js/Business_Logic/ToolsAndTech.js");
require("./js/Business_Logic/TagCloud.min.js");
require("./js/Data_Access_Logic/ToolsAndTechDB.js");
require("./js/Data_Access_Logic/ProjectDB.js");
require("./css/style.css");
require("./css/mq.css");*/

/*import _ from "lodash";
import "./css/style.css";

function component() {
    const element = document.createElement('div');
  
    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    console.log("bleh");
  
    return element;
  }
  
  document.body.appendChild(component());*/


const cache = {};

function importAll(r) {
    r.keys().forEach((key) => (cache[key] = r(key))); 
};

importAll(require.context('./js/', true, /\.js$/));
importAll(require.context('./css/', true, /\.css$/));
//importAll(require.context('./img/', true, /\.(png|svg|jpg|jpeg|gif|webp)$/));
//importAll(require.context('./html/', true, /\.html$/));
importAll(require.context('./assets/', true, /\.pdf$/));
importAll(require.context('./media/', true, /\.mp4$/));

// At build-time cache will be populated with all required modules.