import jQuery from "jquery"
import { Alcmonavis } from "../alcomanavispoeschli";
import Controls from "../src/controls"
import AlcmonavisPoeschli, { parseTree } from "../src/alcmonavispoeschli";

const $ = jQuery;
let alcmonavis: AlcmonavisPoeschli;

const settings: Alcmonavis.Settings = {
    enableNodeVisualizations: true
};
const options:Alcmonavis.Options = {
    backgroundColorDefault: "#FFFFFF"
};
const loc = "http://localhost:1337/api/newick/2021-02-10";
$($ => {
    $.get(loc, (data: string) => {
        var tree = null;
        try {
            tree = parseTree(loc, data, true, false);
        }
        catch (e) {
            alert("error while parsing tree: " + e);
        }
        if (tree) {
            try {
                alcmonavis = new AlcmonavisPoeschli('#phylogram1', tree, options, settings);
                new Controls(alcmonavis, "controls0");
            }
            catch (e) {
                alert("error while launching alcmonavis: " + e);
                throw e;
            }
        }
    }, "text")
    .fail(() => alert("error: failed to read tree(s) from \"" + loc + "\""));
});