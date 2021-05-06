import jQuery, { valHooks } from "jquery"
import { Alcmonavis } from "../alcomanavispoeschli";
import AlcmonavisPoeschli, { parseTree } from "../src/alcmonavispoeschli";
interface Dict<T> {
    [k: string]: T
};

const $ = jQuery;
let alcmonavis: AlcmonavisPoeschli;

const settings: Alcmonavis.Settings = {
    enableNodeVisualizations: true
};
const options: Alcmonavis.Options = {
    backgroundColorDefault: "#FFFFFF",
    initialCollapseDepth: 1
};
const host = "http://localhost:1337/";
const newick = "api/newick/";
const metadata = "api/metadata/";

// const tree = "2021-02-10";
const tree = "test1";
const version = undefined;

$($ => {
    let loc = host + newick + tree;
    if (version) {
        loc += `?version=${version}`;
    }
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

const RunMetadataSearch = async (searchstring: string, family: 0 | 1 = 0) => {
    let loc = host + metadata + tree;
    if (version) {
        loc += `?version=${version}&keyword=${searchstring}`;
    }
    else {
        loc += `?keyword=${searchstring}`;
    }

    const nodes = await Promise.resolve<Dict<string>[]>($.ajax({ url: loc, method: "get" }));

    console.log(nodes);
    alcmonavis.searchNodes(nodes, family);
    $(GoToButtons.subtree).prop("disabled", false);
}

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

const Collapse = {
    "down": "#btn-collapsedown",
    "up": "#btn-collapseup",
    "label": "#collapsevalue",
    "uncollapseall": "#btn-uncollapseall",
}

const MetadataSearch = {
    "input": "#metadataSearchBox",
    "button": "#btn-do-metadatasearch",
    "switch": "#search-family",
    "label": "#search-family + label",
    "found": "#metadata-search-foundnodes"
}

const DisplayData = {
    "modal": "#display-data-modal",
    "title": "#display-data-label",
    "body": "#display-data-body"
}

const Alphabet = "ABCDEFGHIJKLMONPQRSTUVWXYZ".split("");
let count = 0;

let family: 0 | 1 = 0;

const incrementCount = () => {
    count++;
    $(Search.label).text(Alphabet[count])
}

const switchfamily = () => {
    family != family;
    $(MetadataSearch.label).text(Alphabet[family]);
}

function controls(alcmonavis: AlcmonavisPoeschli) {
    // Zoom
    let intervalId: number;
    $("body").on("mousedown", ZoomButtons.up, () => {
        alcmonavis.zoomInY();
        intervalId = setInterval(alcmonavis.zoomInY, 200)
    }).on("mouseup mouseleave", ZoomButtons.up, () => window.clearInterval(intervalId));

    $("body").on("mousedown", ZoomButtons.down, () => {
        alcmonavis.zoomOutY();
        intervalId = setInterval(alcmonavis.zoomOutY, 200)
    }).on("mouseup mouseleave", ZoomButtons.down, () => window.clearInterval(intervalId));

    $("body").on("mousedown", ZoomButtons.left, () => {
        alcmonavis.zoomInX();
        intervalId = setInterval(alcmonavis.zoomInX, 200)
    }).on("mouseup mouseleave", ZoomButtons.left, () => window.clearInterval(intervalId));

    $("body").on("mousedown", ZoomButtons.right, () => {
        alcmonavis.zoomOutX();
        intervalId = setInterval(alcmonavis.zoomOutX, 200)
    }).on("mouseup mouseleave", ZoomButtons.right, () => window.clearInterval(intervalId));

    $("body").on("click", ZoomButtons.recentre, alcmonavis.zoomToFit)

    //Search
    $("body").on("click", Search.button, () => {
        const searchstring = $(Search.input).val();
        if (searchstring && typeof (searchstring) == "string") {
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

    //Collapse
    $("body").on("click", Collapse.down, () => {
        alcmonavis.decrDepthCollapseLevel();
    });

    $("body").on("click", Collapse.up, () => {
        alcmonavis.incrDepthCollapseLevel();
    });

    $("body").on("click", Collapse.uncollapseall, () => {
        alcmonavis.unCollapseAll(alcmonavis.root);
    });

    //MetadataSearch
    $("body").on("click", MetadataSearch.button, async () => {
        const searchstring = $(MetadataSearch.input).val();
        if (searchstring && typeof (searchstring) == "string") {
            console.log(`Searching keyword '${searchstring}'`);
            const searchTimer = performance.now();
            await RunMetadataSearch(searchstring, family);
            console.log(`Finished search in ${performance.now() - searchTimer}ms`);
            switchfamily();
        }
    });

    $("body").on("change", MetadataSearch.switch, () => {
        family = $(MetadataSearch.switch).is(":checked") ? 1 : 0;
        $(MetadataSearch.label).text(Alphabet[family]);
    });

    alcmonavis.AddHandler("forwardEnable", val => {
        $(GoToButtons.forward).prop("disabled", !val);
    });

    alcmonavis.AddHandler("backwardEnable", val => {
        $(GoToButtons.back).prop("disabled", !val);
    });

    alcmonavis.AddHandler("HasParent", val => {
        $(GoToButtons.parent).prop("disabled", val);
    });

    alcmonavis.AddHandler("AtRoot", val => {
        $(GoToButtons.root).prop("disabled", val);
    });

    alcmonavis.AddHandler("DepthCollapseDisplay", val => {
        if (val !== undefined) {
            $(Collapse.label).text(val);
        }
    });

    alcmonavis.AddHandler("DisplayDataModal", val => {
        $(DisplayData.title).text(val.title);
        $(DisplayData.body).html(val.body);
        (window as any).$(DisplayData.modal).modal("show");
    });

    alcmonavis.AddHandler("FoundNodes", val => {
        const text = `Showing ${val.inside} nodes, ${val.outside} nodes outside current view`;
        console.log(text);
        $(MetadataSearch.found).text(text);
    });
}