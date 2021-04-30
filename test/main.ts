import jQuery, { type } from "jquery"
import { Alcmonavis } from "../alcomanavispoeschli";
import AlcmonavisPoeschli, { parseTree } from "../src/alcmonavispoeschli";

const $ = jQuery;
let alcmonavis: AlcmonavisPoeschli;

const settings: Alcmonavis.Settings = {
    enableNodeVisualizations: true
};
const options:Alcmonavis.Options = {
    backgroundColorDefault: "#FFFFFF",
    initialCollapseDepth: 1
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
                controls(alcmonavis);
            }
            catch (e) {
                alert("error while launching alcmonavis: " + e);
                throw e;
            }
        }
    }, "text")
    .fail(() => alert("error: failed to read tree(s) from \"" + loc + "\""));
});

const ZoomButtons = {
    "up": "#btn-zoom-up",
    "down": "#btn-zoom-down",
    "left": "#btn-zoom-left",
    "right": "#btn-zoom-right",
    "recentre": "#btn-zoom-recentre"
}

const Search = {
    "input": "#searchBox",
    "label": "#searchLabel",
    "button": "#btn-do-search"
}

const GoToButtons = {
    "back": "#btn-goback",
    "forward": "#btn-goforward",
    "parent": "#btn-gotoparent",
    "root": "#btn-gotoroot",
    "subtree": "#btn-gotosubtree"
}

const Alphabet = "ABCDEFGHIJKLMONPQRSTUVWXYZ".split("");
let count = 0;

const incrementCount = () => {
    count++;
    $(Search.label).text(Alphabet[count])
}

function controls(alcmonavis: AlcmonavisPoeschli){
    // Zoom
    let intervalId: number;
    $("body").on("mousedown", ZoomButtons.up, () => {
        alcmonavis.zoomInX();
        intervalId = setInterval(alcmonavis.zoomInY, 200)
    }).on("mouseup mouseleave", ZoomButtons.up, () => window.clearInterval(intervalId));

    $("body").on("mousedown", ZoomButtons.down, () => {
        alcmonavis.zoomInX();
        intervalId = setInterval(alcmonavis.zoomOutY, 200)
    }).on("mouseup mouseleave", ZoomButtons.down, () => window.clearInterval(intervalId));

    $("body").on("mousedown", ZoomButtons.left, () => {
        alcmonavis.zoomInX();
        intervalId = setInterval(alcmonavis.zoomInX, 200)
    }).on("mouseup mouseleave", ZoomButtons.left, () => window.clearInterval(intervalId));

    $("body").on("mousedown", ZoomButtons.right, () => {
        alcmonavis.zoomInX();
        intervalId = setInterval(alcmonavis.zoomOutX, 200)
    }).on("mouseup mouseleave", ZoomButtons.right, () => window.clearInterval(intervalId));

    $("body").on("click", ZoomButtons.recentre, alcmonavis.zoomToFit)

    //Search
    $("body").on("click", Search.button, () => {
        const searchstring = $(Search.input).val();
        if(searchstring && typeof(searchstring) == "string") {
            alcmonavis.search0Text(searchstring);
            incrementCount();
            $(GoToButtons.subtree).prop("disabled", false);
        }
    });

    //Go to
    $("body").on("click", GoToButtons.subtree, () => {
        alcmonavis.goToSearch();
        $(GoToButtons.subtree).prop("disabled", true);
    });

    $("body").on("click", GoToButtons.parent, () => {
        alcmonavis.goToParent();
    });

    $("body").on("click", GoToButtons.root, () => {
        alcmonavis.goToRootTree();
    });

    $("body").on("click", GoToButtons.forward, () => {
        alcmonavis.goForward();
    });

    $("body").on("click", GoToButtons.back, () => {
        alcmonavis.goBackward();
    });

    alcmonavis.AddHandler("forwardEnable", (val: string | number | boolean | undefined) => {
        const value = Boolean(val);
        $(GoToButtons.forward).prop("disabled", !value);
    });

    alcmonavis.AddHandler("backwardEnable", (val: string | number | boolean | undefined) => {
        const value = Boolean(val);
        $(GoToButtons.back).prop("disabled", !value);
    });

    alcmonavis.AddHandler("HasParent", (val: string | number | boolean | undefined) => {
        const value = Boolean(val);
        $(GoToButtons.parent).prop("disabled", value);
    });

    alcmonavis.AddHandler("AtRoot", (val: string | number | boolean | undefined) => {
        const value = Boolean(val);
        $(GoToButtons.root).prop("disabled", value);
    });
}