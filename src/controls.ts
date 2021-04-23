import { Alcmonavis, HTMLstring } from "../alcomanavispoeschli";
import alcmonavispoeschli, { OptionsDeclared, SettingsDeclared } from "./alcmonavispoeschli";
import * as AP from './constants';
import $ from 'jquery';

(window as any).jQuery = $;
require('jquery-ui/ui/version');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/ie');
require('jquery-ui/ui/data');
require('jquery-ui/ui/plugin');
require('jquery-ui/ui/safe-active-element');
require('jquery-ui/ui/safe-blur');
require('jquery-ui/ui/scroll-parent');
require('jquery-ui/ui/form');
require('jquery-ui/ui/escape-selector');
require('jquery-ui/ui/labels');
require('jquery-ui/ui/form-reset-mixin');
require('jquery-ui/ui/keycode');
require('jquery-ui/ui/widgets/mouse');
require('jquery-ui/ui/widgets/checkboxradio');
require('jquery-ui/ui/widgets/controlgroup');
require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/widgets/button');
require('jquery-ui/ui/widgets/slider');


export default class Controls {
    alcmonavis: alcmonavispoeschli;
    options: Required<Alcmonavis.RequiredOptions> & Alcmonavis.OptionalOptions;
    settings: Required<Alcmonavis.RequiredSettings> & Alcmonavis.OptionalSettings;

    intervalId!: number;

    constructor(alc: alcmonavispoeschli, controls0?: string, controls1?: string) {
        this.alcmonavis = alc;
        if (!OptionsDeclared(this.alcmonavis.options)) throw 'Options not set';
        if (!SettingsDeclared(this.alcmonavis.settings)) throw 'Settings not set';
        this.options = this.alcmonavis.options,
            this.settings = this.alcmonavis.settings;

        var c0 = $('#' + controls0);

        if (c0) {
            c0.css({
                position: 'absolute',
                left: this.settings.controls0Left,
                top: this.settings.controls0Top + this.alcmonavis.offsetTop,
                'text-align': 'left',
                padding: '0px',
                margin: '0 0 0 0',
                opacity: 0.8,
                'background-color': this.settings.controlsBackgroundColor,
                color: this.settings.controlsFontColor,
                'font-size': this.settings.controlsFontSize,
                'font-family': this.settings.controlsFont
                    .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
                    .reduce((p, v) => p + ', ' + v),
                'font-style': 'normal',
                'font-weight': 'normal',
                'text-decoration': 'none',
            });

            c0.draggable({ containment: 'parent' });

            c0.append(this.makeProgramDesc());

            c0.append(this.makePhylogramControl());

            c0.append(this.makeDisplayControl());

            c0.append(this.makeZoomControl());

            var pn = $('.' + AP.PROG_NAME);
            if (pn) {
                pn.css({
                    'text-align': 'center',
                    'padding-top': '3px',
                    'padding-bottom': '5px',
                    'font-size': this.settings.controlsFontSize,
                    'font-family': this.settings.controlsFont
                        .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
                        .reduce((p, v) => p + ', ' + v),
                    'font-style': 'italic',
                    'font-weight': 'bold',
                    'text-decoration': 'none',
                });
            }
            var pnl = $('.' + AP.PROGNAMELINK);
            if (pnl) {
                pnl.css({
                    color: AP.COLOR_FOR_ACTIVE_ELEMENTS,
                    'font-size': this.settings.controlsFontSize,
                    'font-family': this.settings.controlsFont
                        .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
                        .reduce((p, v) => p + ', ' + v),
                    'font-style': 'italic',
                    'font-weight': 'bold',
                    'text-decoration': 'none',
                    border: 'none',
                });
                $('.' + AP.PROGNAMELINK + ':hover').css({
                    color: AP.COLOR_FOR_ACTIVE_ELEMENTS,
                    'font-size': this.settings.controlsFontSize,
                    'font-family': this.settings.controlsFont
                        .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
                        .reduce((p, v) => p + ', ' + v),
                    'font-style': 'italic',
                    'font-weight': 'bold',
                    'text-decoration': 'none',
                    border: 'none',
                });
                $('.' + AP.PROGNAMELINK + ':link').css({
                    color: AP.COLOR_FOR_ACTIVE_ELEMENTS,
                    'font-size': this.settings.controlsFontSize,
                    'font-family': this.settings.controlsFont
                        .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
                        .reduce((p, v) => p + ', ' + v),
                    'font-style': 'italic',
                    'font-weight': 'bold',
                    'text-decoration': 'none',
                    border: 'none',
                });
                $('.' + AP.PROGNAMELINK + ':visited').css({
                    color: AP.COLOR_FOR_ACTIVE_ELEMENTS,
                    'font-size': this.settings.controlsFontSize,
                    'font-family': this.settings.controlsFont
                        .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
                        .reduce((p, v) => p + ', ' + v),
                    'font-style': 'italic',
                    'font-weight': 'bold',
                    'text-decoration': 'none',
                    border: 'none',
                });
            }

            $('.' + AP.PHYLOGRAM_CLADOGRAM_CONTROLGROUP).controlgroup({
                direction: 'horizontal',
            });

            $('.' + AP.DISPLAY_DATA_CONTROLGROUP).controlgroup({
                direction: 'vertical',
            });

            c0.append(this.makeControlButtons());

            c0.append(this.makeSliders());

            c0.append(this.makeSearchBoxes());

            $('.' + AP.SEARCH_OPTIONS_GROUP).controlgroup({
                direction: 'horizontal',
            });

            c0.append(this.makeAutoCollapse());

            if (this.settings.enableDownloads) {
                c0.append(this.makeDownloadSection());
            }
        }

        var c1 = $('#' + controls1);
        if (c1) {
            c1.css({
                position: 'absolute',
                left: this.settings.controls1Left,
                top: this.settings.controls1Top + this.alcmonavis.offsetTop,
                'text-align': 'left',
                padding: '0px',
                margin: '0 0 0 0',
                opacity: 0.8,
                'background-color': this.settings.controlsBackgroundColor,
                color: this.settings.controlsFontColor,
                'font-size': this.settings.controlsFontSize,
                'font-family': this.settings.controlsFont
                    .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
                    .reduce((p, v) => p + ', ' + v),
                'font-style': 'normal',
                'font-weight': 'normal',
                'text-decoration': 'none',
            });

            c1.draggable({ containment: 'parent' });

            if (this.settings.enableNodeVisualizations && this.alcmonavis.nodeVisualizations) {
                c1.append(this.makeVisualControls());
                if (this.alcmonavis.isCanDoMsaResidueVisualizations()) {
                    c1.append(this.makeMsaResidueVisCurrResPositionControl());
                }

                if (this.alcmonavis.isAddVisualization2() && this.alcmonavis.specialVisualizations != null) {
                    //~~
                    if ('Mutations' in this.alcmonavis.specialVisualizations) {
                        const mutations = this.alcmonavis.specialVisualizations['Mutations'];
                        if (mutations != null) {
                            c1.append(this.makeVisualization2(mutations.label));
                            this.alcmonavis.visualizations2_color = mutations.color;
                            this.alcmonavis.visualizations2_applies_to_ref = mutations.applies_to_ref;
                            this.alcmonavis.visualizations2_property_datatype = mutations.property_datatype;
                            this.alcmonavis.visualizations2_property_applies_to = mutations.property_applies_to;
                            console.log(
                                AP.MESSAGE + 'Setting special visualization property ref to: ' + this.alcmonavis.visualizations2_applies_to_ref,
                            );
                            console.log(
                                AP.MESSAGE +
                                'Setting special visualization property applies to to: ' +
                                this.alcmonavis.visualizations2_property_applies_to,
                            );
                            console.log(
                                AP.MESSAGE +
                                'Setting special visualization property datatype to: ' +
                                this.alcmonavis.visualizations2_property_datatype,
                            );
                            console.log(AP.MESSAGE + 'Setting special visualization color to: ' + this.alcmonavis.visualizations2_color);
                        }
                    }
                }
                if (this.alcmonavis.isAddVisualization3() && this.alcmonavis.specialVisualizations != null) {
                    //~~
                    if ('Convergent_Mutations' in this.alcmonavis.specialVisualizations) {
                        const conv_mutations = this.alcmonavis.specialVisualizations['Convergent_Mutations'];
                        if (conv_mutations != null) {
                            c1.append(this.makeVisualization3(conv_mutations.label));
                            this.alcmonavis.visualizations3_color = conv_mutations.color;
                            this.alcmonavis.visualizations3_applies_to_ref = conv_mutations.applies_to_ref;
                            this.alcmonavis.visualizations3_property_datatype = conv_mutations.property_datatype;
                            this.alcmonavis.visualizations3_property_applies_to = conv_mutations.property_applies_to;
                            console.log(
                                AP.MESSAGE + 'Setting special visualization property ref to: ' + this.alcmonavis.visualizations3_applies_to_ref,
                            );
                            console.log(
                                AP.MESSAGE +
                                'Setting special visualization property applies to to: ' +
                                this.alcmonavis.visualizations3_property_applies_to,
                            );
                            console.log(
                                AP.MESSAGE +
                                'Setting special visualization property datatype to: ' +
                                this.alcmonavis.visualizations3_property_datatype,
                            );
                            console.log(AP.MESSAGE + 'Setting special visualization color to: ' + this.alcmonavis.visualizations3_color);
                        }
                    }
                }

                c1.append(this.makeLegendControl());
            }
        }

        $<HTMLInputElement>('input:button').button().css({
            width: '26px',
            'text-align': 'center',
            outline: 'none',
            margin: '0px',
            'font-style': 'normal',
            'font-weight': 'normal',
            'text-decoration': 'none',
        });

        $('#' + AP.ZOOM_IN_Y + ', #' + AP.ZOOM_OUT_Y).css({
            width: '78px',
        });

        $(
            '#' +
            AP.ZOOM_IN_Y +
            ', #' +
            AP.ZOOM_OUT_Y +
            ', #' +
            AP.ZOOM_TO_FIT +
            ', #' +
            AP.ZOOM_IN_X +
            ', #' +
            AP.ZOOM_OUT_X,
        ).css({
            height: '16px',
        });

        $(
            '#' +
            AP.DECR_DEPTH_COLLAPSE_LEVEL +
            ', #' +
            AP.INCR_DEPTH_COLLAPSE_LEVEL +
            ', #' +
            AP.DECR_BL_COLLAPSE_LEVEL +
            ', #' +
            AP.INCR_BL_COLLAPSE_LEVEL,
        ).css({
            width: '16px',
        });

        $('#' + AP.LEGENDS_MOVE_UP_BTN + ', #' + AP.LEGENDS_MOVE_DOWN_BTN).css({
            width: '72px',
        });

        $('#' + AP.LEGENDS_RESET_BTN + ', #' + AP.LEGENDS_MOVE_LEFT_BTN + ', #' + AP.LEGENDS_MOVE_RIGHT_BTN).css({
            width: '24px',
        });

        $('#' + AP.LEGENDS_SHOW_BTN + ', #' + AP.LEGENDS_HORIZ_VERT_BTN).css({
            width: '36px',
        });

        $(
            '#' +
            AP.LEGENDS_MOVE_UP_BTN +
            ', #' +
            AP.LEGENDS_MOVE_DOWN_BTN +
            ', #' +
            AP.LEGENDS_RESET_BTN +
            ', #' +
            AP.LEGENDS_MOVE_LEFT_BTN +
            ', #' +
            AP.LEGENDS_MOVE_RIGHT_BTN +
            ', #' +
            AP.LEGENDS_SHOW_BTN +
            ', #' +
            AP.LEGENDS_HORIZ_VERT_BTN,
        ).css({
            height: '16px',
        });

        var downloadButton = $('#' + AP.DOWNLOAD_BUTTON);

        if (downloadButton) {
            downloadButton.css({
                width: '60px',
                'margin-bottom': '3px',
            });
        }

        $<HTMLInputElement>(':radio').checkboxradio({
            icon: false,
        });

        $<HTMLInputElement>(':checkbox').checkboxradio({
            icon: false,
        });

        this.alcmonavis.AddHandler("showNodeName", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.NODE_NAME_CB, val as boolean));
        this.alcmonavis.AddHandler("showExternalLabels", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.EXTERNAL_LABEL_CB, val as boolean));
        this.alcmonavis.AddHandler("showInternalLabels", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.INTERNAL_LABEL_CB, val as boolean));
        this.alcmonavis.AddHandler("showExternalNodes", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.EXTERNAL_NODES_CB, val as boolean));
        this.alcmonavis.AddHandler("showInternalNodes", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.INTERNAL_NODES_CB, val as boolean));
        this.alcmonavis.AddHandler("showNodeVisualizations", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.NODE_VIS_CB, val as boolean));
        this.alcmonavis.AddHandler("showBranchVisualizations", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.BRANCH_VIS_CB, val as boolean));
        this.alcmonavis.AddHandler("searchUsesRegex", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.SEARCH_OPTIONS_REGEX_CB, val as boolean));
        this.alcmonavis.AddHandler("searchIsComplete", (val: string | number | boolean | undefined) => this.setCheckboxValue(AP.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB, val as boolean));
        this.alcmonavis.AddHandler("displayType", this.setDisplayTypeButtons);




        $('#' + AP.SEARCH_FIELD_0).on('keyup', this.alcmonavis.search0);

        $('#' + AP.SEARCH_FIELD_1).on('keyup', this.alcmonavis.search1);

        $('#' + AP.PHYLOGRAM_BUTTON).on('click', this.alcmonavis.toPhylogram);

        $('#' + AP.PHYLOGRAM_ALIGNED_BUTTON).on('click', this.alcmonavis.toAlignedPhylogram);

        $('#' + AP.CLADOGRAM_BUTTON).on('click', this.alcmonavis.toCladegram);

        $('#' + AP.NODE_NAME_CB).on('click', this.alcmonavis.nodeNameCbClicked);

        $('#' + AP.TAXONOMY_CB).on('click', this.alcmonavis.taxonomyCbClicked);

        $('#' + AP.SEQUENCE_CB).on('click', this.alcmonavis.sequenceCbClicked);

        $('#' + AP.CONFIDENCE_VALUES_CB).on('click', this.alcmonavis.confidenceValuesCbClicked);

        $('#' + AP.BRANCH_LENGTH_VALUES_CB).on('click', this.alcmonavis.branchLengthsCbClicked);

        $('#' + AP.NODE_EVENTS_CB).on('click', this.alcmonavis.nodeEventsCbClicked);

        $('#' + AP.BRANCH_EVENTS_CB).on('click', this.alcmonavis.branchEventsCbClicked);

        $('#' + AP.INTERNAL_LABEL_CB).on('click', this.alcmonavis.internalLabelsCbClicked);

        $('#' + AP.EXTERNAL_LABEL_CB).on('click', this.alcmonavis.externalLabelsCbClicked);

        $('#' + AP.INTERNAL_NODES_CB).on('click', this.alcmonavis.internalNodesCbClicked);

        $('#' + AP.EXTERNAL_NODES_CB).on('click', this.alcmonavis.externalNodesCbClicked);

        $('#' + AP.NODE_VIS_CB).on('click', this.alcmonavis.nodeVisCbClicked);

        $('#' + AP.BRANCH_VIS_CB).on('click', this.alcmonavis.branchVisCbClicked);

        $('#' + AP.BRANCH_COLORS_CB).on('click', this.alcmonavis.branchColorsCbClicked);

        $('#' + AP.DYNAHIDE_CB).on('click', this.alcmonavis.dynaHideCbClicked);

        $('#' + AP.SHORTEN_NODE_NAME_CB).on('click', this.alcmonavis.shortenCbClicked);

        $<HTMLSelectElement>('#' + AP.LABEL_COLOR_SELECT_MENU).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    if (self.alcmonavis.isAddVisualization2()) {
                        self.alcmonavis.setSelectMenuValue(AP.LABEL_COLOR_SELECT_MENU_2, AP.DEFAULT);
                    }
                    if (self.alcmonavis.isAddVisualization3()) {
                        self.alcmonavis.setSelectMenuValue(AP.LABEL_COLOR_SELECT_MENU_3, AP.DEFAULT);
                    };
                    self.alcmonavis.setLabelColorMenu(v, "legend");
                }
                return _;
            })(this)
        );

        $<HTMLSelectElement>('#' + AP.LABEL_COLOR_SELECT_MENU_2).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    if (self.alcmonavis.isAddVisualization3()) {
                        self.alcmonavis.setSelectMenuValue(AP.LABEL_COLOR_SELECT_MENU_3, AP.DEFAULT);
                    }
                    self.alcmonavis.setLabelColorMenu(v, "check");
                }
                return _;
            })(this)
        );

        $<HTMLSelectElement>('#' + AP.LABEL_COLOR_SELECT_MENU_3).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    if (self.alcmonavis.isAddVisualization2()) {
                        self.alcmonavis.setSelectMenuValue(AP.LABEL_COLOR_SELECT_MENU_2, AP.DEFAULT);
                    }
                    self.alcmonavis.setLabelColorMenu(v, "check");
                }
                return _;
            })(this)
        );

        $<HTMLSelectElement>('#' + AP.NODE_FILL_COLOR_SELECT_MENU).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    if (self.alcmonavis.isAddVisualization2()) {
                        self.alcmonavis.setSelectMenuValue(AP.NODE_FILL_COLOR_SELECT_MENU_2, AP.DEFAULT);
                    }
                    if (self.alcmonavis.isAddVisualization3()) {
                        self.alcmonavis.setSelectMenuValue(AP.NODE_FILL_COLOR_SELECT_MENU_3, AP.DEFAULT);
                    }
                    self.alcmonavis.setFillColorMenu(v, "legend");
                }
                return _;
            })(this)
        );

        $<HTMLSelectElement>('#' + AP.NODE_FILL_COLOR_SELECT_MENU_2).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    if (self.alcmonavis.isAddVisualization3()) {
                        self.alcmonavis.setSelectMenuValue(AP.NODE_FILL_COLOR_SELECT_MENU_3, AP.DEFAULT);
                    }
                    self.alcmonavis.setFillColorMenu(v, "check");
                }
                return _;
            })(this)
        );

        $<HTMLSelectElement>('#' + AP.NODE_FILL_COLOR_SELECT_MENU_3).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    if (self.alcmonavis.isAddVisualization2()) {
                        self.alcmonavis.setSelectMenuValue(AP.NODE_FILL_COLOR_SELECT_MENU_2, AP.DEFAULT);
                    }
                    self.alcmonavis.setFillColorMenu(v, "check");
                }
                return _;
            })(this)
        );

        $<HTMLSelectElement>('#' + AP.NODE_SHAPE_SELECT_MENU).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    self.alcmonavis.setShapeSelectMenu(v);
                }
                return _;
            })(this)
        );

        $<HTMLSelectElement>('#' + AP.NODE_SIZE_SELECT_MENU).on('change', (
            (self: Controls) => {
                const _: (this: HTMLSelectElement) => void = function () {
                    const v = this.value;
                    self.alcmonavis.setSizeSelectMenu(v);
                }
                return _;
            })(this)
        );

        $('#' + AP.NODE_SIZE_SLIDER).slider({
            min: AP.NODE_SIZE_MIN,
            max: AP.NODE_SIZE_MAX,
            step: AP.SLIDER_STEP,
            value: this.options.nodeSizeDefault,
            animate: 'fast',
            slide: this.alcmonavis.changeNodeSize,
            change: this.alcmonavis.changeNodeSize,
        });

        $('#' + AP.BRANCH_WIDTH_SLIDER).slider({
            min: AP.BRANCH_WIDTH_MIN,
            max: AP.BRANCH_WIDTH_MAX,
            step: AP.SLIDER_STEP,
            value: this.options.branchWidthDefault,
            animate: 'fast',
            slide: this.alcmonavis.changeBranchWidth,
            change: this.alcmonavis.changeBranchWidth,
        });

        $('#' + AP.EXTERNAL_FONT_SIZE_SLIDER).slider({
            min: AP.FONT_SIZE_MIN,
            max: AP.FONT_SIZE_MAX,
            step: AP.SLIDER_STEP,
            value: +this.options.externalNodeFontSize,
            animate: 'fast',
            slide: this.alcmonavis.changeExternalFontSize,
            change: this.alcmonavis.changeExternalFontSize,
        });

        $('#' + AP.INTERNAL_FONT_SIZE_SLIDER).slider({
            min: AP.FONT_SIZE_MIN,
            max: AP.FONT_SIZE_MAX,
            step: AP.SLIDER_STEP,
            value: +this.options.internalNodeFontSize,
            animate: 'fast',
            slide: this.alcmonavis.changeInternalFontSize,
            change: this.alcmonavis.changeInternalFontSize,
        });

        $('#' + AP.BRANCH_DATA_FONT_SIZE_SLIDER).slider({
            min: AP.FONT_SIZE_MIN,
            max: AP.FONT_SIZE_MAX,
            step: AP.SLIDER_STEP,
            value: +this.options.branchDataFontSize,
            animate: 'fast',
            slide: this.alcmonavis.changeBranchDataFontSize,
            change: this.alcmonavis.changeBranchDataFontSize,
        });

        $('#' + AP.SEARCH_FIELD_0 + ', #' + AP.SEARCH_FIELD_1)
            .off('keydown')
            .off('mouseenter')
            .off('mousedown')
            .css({
                font: 'inherit',
                color: 'inherit',
                'text-align': 'left',
                outline: 'none',
                cursor: 'text',
                width: this.settings.searchFieldWidth,
                height: this.settings.textFieldHeight,
            });

        $('#' + AP.DEPTH_COLLAPSE_LABEL + ', #' + AP.BL_COLLAPSE_LABEL)
            .button()
            .off('keydown')
            .off('mouseenter')
            .off('mousedown')
            .attr('disabled', 'disabled')
            .css({
                font: 'inherit',
                color: 'inherit',
                'text-align': 'center',
                outline: 'none',
                cursor: 'text',
                width: this.settings.collapseLabelWidth,
            });

        $('#' + AP.ZOOM_IN_Y)
            .mousedown(() => {
                this.alcmonavis.zoomInY();
                this.intervalId = window.setInterval(this.alcmonavis.zoomInY, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.ZOOM_OUT_Y)
            .mousedown(() => {
                this.alcmonavis.zoomOutY();
                this.intervalId = window.setInterval(this.alcmonavis.zoomOutY, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.ZOOM_IN_X)
            .mousedown(() => {
                this.alcmonavis.zoomInX();
                this.intervalId = window.setInterval(this.alcmonavis.zoomInX, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.ZOOM_OUT_X)
            .mousedown(() => {
                this.alcmonavis.zoomOutX();
                this.intervalId = window.setInterval(this.alcmonavis.zoomOutX, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.DECR_DEPTH_COLLAPSE_LEVEL)
            .mousedown(() => {
                this.alcmonavis.decrDepthCollapseLevel();
                this.intervalId = window.setInterval(this.alcmonavis.decrDepthCollapseLevel, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });
        $('#' + AP.INCR_DEPTH_COLLAPSE_LEVEL)
            .mousedown(() => {
                this.alcmonavis.incrDepthCollapseLevel();
                this.intervalId = window.setInterval(this.alcmonavis.incrDepthCollapseLevel, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });
        $('#' + AP.DECR_BL_COLLAPSE_LEVEL)
            .mousedown(() => {
                this.alcmonavis.decrBlCollapseLevel();
                this.intervalId = window.setInterval(this.alcmonavis.decrBlCollapseLevel, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });
        $('#' + AP.INCR_BL_COLLAPSE_LEVEL)
            .mousedown(() => {
                this.alcmonavis.incrBlCollapseLevel();
                this.intervalId = window.setInterval(this.alcmonavis.incrBlCollapseLevel, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.ZOOM_TO_FIT).mousedown(this.alcmonavis.zoomToFit);

        $('#' + AP.RETURN_TO_SUPERTREE_BUTTON).mousedown(this.alcmonavis.returnToSupertreeButtonPressed);

        $('#' + AP.ORDER_BUTTON).mousedown(this.alcmonavis.orderButtonPressed);

        $('#' + AP.UNCOLLAPSE_ALL_BUTTON).mousedown(this.alcmonavis.uncollapseAllButtonPressed);

        $('#' + AP.MIDPOINT_ROOT_BUTTON).mousedown(this.alcmonavis.midpointRootButtonPressed);

        // Search Controls
        // ---------------

        $('#' + AP.SEARCH_OPTIONS_CASE_SENSITIVE_CB).click(this.alcmonavis.searchOptionsCaseSenstiveCbClicked);
        $('#' + AP.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB).click(this.alcmonavis.searchOptionsCompleteTermsOnlyCbClicked);
        $('#' + AP.SEARCH_OPTIONS_REGEX_CB).click(this.alcmonavis.searchOptionsRegexCbClicked);
        $('#' + AP.SEARCH_OPTIONS_NEGATE_RES_CB).click(this.alcmonavis.searchOptionsNegateResultCbClicked);

        $('#' + AP.RESET_SEARCH_A_BTN).mousedown(this.alcmonavis.resetSearch0);
        $('#' + AP.RESET_SEARCH_B_BTN).mousedown(this.alcmonavis.resetSearch1);

        // Visualization Legends
        // ---------------------

        $('#' + AP.LEGENDS_MOVE_UP_BTN)
            .mousedown(() => {
                this.alcmonavis.legendMoveUp(2);
                this.intervalId = window.setInterval(this.alcmonavis.legendMoveUp, AP.MOVE_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.LEGENDS_MOVE_DOWN_BTN)
            .mousedown(() => {
                this.alcmonavis.legendMoveDown(2);
                this.intervalId = window.setInterval(this.alcmonavis.legendMoveDown, AP.MOVE_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.LEGENDS_MOVE_LEFT_BTN)
            .mousedown(() => {
                this.alcmonavis.legendMoveLeft(2);
                this.intervalId = window.setInterval(this.alcmonavis.legendMoveLeft, AP.MOVE_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.LEGENDS_MOVE_RIGHT_BTN)
            .mousedown(() => {
                this.alcmonavis.legendMoveRight(2);
                this.intervalId = window.setInterval(this.alcmonavis.legendMoveRight, AP.MOVE_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.LEGENDS_HORIZ_VERT_BTN).click(this.alcmonavis.legendHorizVertClicked);
        $('#' + AP.LEGENDS_SHOW_BTN).click(this.alcmonavis.legendShowClicked);
        $('#' + AP.LEGENDS_RESET_BTN).click(this.alcmonavis.legendResetClicked);

        // ----------------

        if (downloadButton) {
            downloadButton.mousedown(this.alcmonavis.downloadButtonPressed);
        }

        // Collapse
        // ---------------

        $('#' + AP.COLLAPSE_BY_FEATURE_SELECT)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.EXPORT_FORMAT_SELECT)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.COLLAPSE_BY_FEATURE_SELECT).on('change', () => {
            var s = $('#' + AP.COLLAPSE_BY_FEATURE_SELECT);
            if (s) {
                var f = s.val();
                if (f && typeof f === 'string') {
                    this.alcmonavis.collapseByFeature(f);
                }
            }
        });

        // ---------------

        // Visualizations
        // ---------------

        $('#' + AP.LABEL_COLOR_SELECT_MENU)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_FILL_COLOR_SELECT_MENU)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_BORDER_COLOR_SELECT_MENU)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_SHAPE_SELECT_MENU)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_SIZE_SELECT_MENU)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.LABEL_COLOR_SELECT_MENU_2) //~~
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_FILL_COLOR_SELECT_MENU_2)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_BORDER_COLOR_SELECT_MENU_2)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.LABEL_COLOR_SELECT_MENU_3) //~~~
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_FILL_COLOR_SELECT_MENU_3)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        $('#' + AP.NODE_BORDER_COLOR_SELECT_MENU_3)
            .select()
            .css({
                font: 'inherit',
                color: 'inherit',
            });

        // MSA residue visualization: Position control
        // -------------------------------------------
        $('#' + AP.MSA_RESIDUE_VIS_DECR_CURR_RES_POS_BTN + ', #' + AP.MSA_RESIDUE_VIS_INCR_CURR_RES_POS_BTN).css({
            width: '18px',
        });

        $('#' + AP.MSA_RESIDUE_VIS_CURR_RES_POS_LABEL)
            .off('keydown')
            .off('mouseenter')
            .off('mousedown')
            .css({
                font: 'inherit',
                color: 'inherit',
                'text-align': 'center',
                outline: 'none',
                cursor: 'text',
                width: '28px',
                height: this.settings.textFieldHeight,
            });

        // split?
        $('#' + AP.MSA_RESIDUE_VIS_CURR_RES_POS_LABEL).keyup(
            (e: JQuery.KeyUpEvent<HTMLElement, null, HTMLElement, HTMLElement>) => {
                var keycode = e.keyCode;
                if (
                    (keycode >= AP.VK_0 && keycode <= AP.VK_9) ||
                    (keycode >= AP.VK_0_NUMPAD && keycode <= AP.VK_9_NUMPAD) ||
                    keycode === AP.VK_BACKSPACE ||
                    keycode === AP.VK_DELETE
                ) {
                    var i = 0;
                    if (
                        ((keycode >= AP.VK_0 && keycode <= AP.VK_9) || (keycode >= AP.VK_0_NUMPAD && keycode <= AP.VK_9_NUMPAD)) &&
                        this.alcmonavis.basicTreeProperties &&
                        this.alcmonavis.basicTreeProperties.maxMolSeqLength &&
                        this.alcmonavis.msa_residue_vis_curr_res_pos >= this.alcmonavis.basicTreeProperties.maxMolSeqLength - 1
                    ) {
                        if (keycode >= AP.VK_0 && keycode <= AP.VK_9) {
                            i = keycode - 48;
                        } else {
                            i = keycode - 96;
                        }
                    } else {
                        var x = ($('#' + AP.MSA_RESIDUE_VIS_CURR_RES_POS_LABEL).val() as string).trim();
                        if (x === '') {
                            return;
                        }
                        i = parseInt(x);
                        if (i === null || i === undefined || isNaN(i) || i < 0) {
                            i = 0;
                        }
                    }
                    this.alcmonavis.showMsaResidueVisualizationAsLabelColorIfNotAlreadyShown();
                    this.alcmonavis.setMsaResidueVisCurrResPos(i - 1);
                    this.alcmonavis.updateMsaResidueVisCurrResPosLabel();
                    this.alcmonavis.updateMsaResidueVisCurrResPosSliderValue();
                    this.alcmonavis.update(undefined, 0, true);
                } else {
                    this.alcmonavis.update(undefined, 0, true);
                }
            },
        );

        $('#' + AP.MSA_RESIDUE_VIS_DECR_CURR_RES_POS_BTN)
            .mousedown(() => {
                this.alcmonavis.decrMsaResidueVisCurrResPos();
                this.intervalId = window.setInterval(this.alcmonavis.decrMsaResidueVisCurrResPos, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        $('#' + AP.MSA_RESIDUE_VIS_INCR_CURR_RES_POS_BTN)
            .mousedown(() => {
                this.alcmonavis.incrMsaResidueVisCurrResPos();
                this.intervalId = window.setInterval(this.alcmonavis.incrMsaResidueVisCurrResPos, AP.ZOOM_INTERVAL);
            })
            .bind('mouseup mouseleave', () => {
                window.clearTimeout(this.intervalId);
            });

        // -------------------------------------------

        $(document).keyup((e) => {
            if (e.altKey) {
                switch (e.keyCode) {
                    case AP.VK_0:
                        this.alcmonavis.orderButtonPressed();
                        break;
                    case AP.VK_R:
                        this.alcmonavis.returnToSupertreeButtonPressed();
                        break;
                    case AP.VK_U:
                        this.alcmonavis.uncollapseAllButtonPressed();
                        break;
                    case AP.VK_M:
                        this.alcmonavis.midpointRootButtonPressed();
                        break;
                    case AP.VK_P:
                        this.alcmonavis.cycleDisplay();
                        break;
                    //case AP.VK_L: alcmonavis.toggleAlignPhylogram(); break; // BM what is alcmonavis?
                    case AP.VK_OPEN_BRACKET:
                        if (this.alcmonavis.isCanDoMsaResidueVisualizations()) {
                            this.alcmonavis.decrMsaResidueVisCurrResPos();
                        }
                        break;
                    case AP.VK_CLOSE_BRACKET:
                        if (this.alcmonavis.isCanDoMsaResidueVisualizations()) {
                            this.alcmonavis.incrMsaResidueVisCurrResPos();
                        }
                        break;
                    case AP.VK_ESC:
                        this.alcmonavis.escPressed();
                        break;
                    case AP.VK_C:
                    case AP.VK_DELETE:
                    case AP.VK_BACKSPACE:
                    case AP.VK_HOME:
                        this.alcmonavis.zoomToFit();
                        break;
                    default:
                }
            } else if (e.keyCode === AP.VK_HOME) {
                this.alcmonavis.zoomToFit();
            } else if (e.keyCode === AP.VK_ESC) {
                this.alcmonavis.escPressed();
            }
        });

        $(document).keydown((e) => {
            if (e.altKey) {
                switch (e.keyCode) {
                    case AP.VK_UP:
                        this.alcmonavis.zoomInY(AP.BUTTON_ZOOM_IN_FACTOR_SLOW);
                        break;
                    case AP.VK_DOWN:
                        this.alcmonavis.zoomOutY(AP.BUTTON_ZOOM_OUT_FACTOR_SLOW);
                        break;
                    case AP.VK_LEFT:
                        this.alcmonavis.zoomOutX(AP.BUTTON_ZOOM_OUT_FACTOR_SLOW);
                        break;
                    case AP.VK_RIGHT:
                        this.alcmonavis.zoomInX(AP.BUTTON_ZOOM_IN_FACTOR_SLOW);
                        break;
                    case AP.VK_PLUS:
                    case AP.VK_PLUS_N:
                        if (e.shiftKey) {
                            this.alcmonavis.increaseFontSizes();
                        } else {
                            this.alcmonavis.zoomInY(AP.BUTTON_ZOOM_IN_FACTOR_SLOW);
                            this.alcmonavis.zoomInX(AP.BUTTON_ZOOM_IN_FACTOR_SLOW);
                        }
                        break;
                    case AP.VK_MINUS:
                    case AP.VK_MINUS_N:
                        if (e.shiftKey) {
                            this.alcmonavis.decreaseFontSizes();
                        } else {
                            this.alcmonavis.zoomOutY(AP.BUTTON_ZOOM_OUT_FACTOR_SLOW);
                            this.alcmonavis.zoomOutX(AP.BUTTON_ZOOM_OUT_FACTOR_SLOW);
                        }
                        break;
                    case AP.VK_A:
                        this.alcmonavis.decrDepthCollapseLevel();
                        break;
                    case AP.VK_S:
                        this.alcmonavis.incrDepthCollapseLevel();
                        break;
                    default:
                }
            }
            if (e.keyCode === AP.VK_PAGE_UP) {
                this.alcmonavis.increaseFontSizes();
            } else if (e.keyCode === AP.VK_PAGE_DOWN) {
                this.alcmonavis.decreaseFontSizes();
            }
        });

        $(document).on('mousewheel DOMMouseScroll', (e) => {
            if (e.shiftKey) {
                if (e.originalEvent) {
                    var oe = e.originalEvent as WheelEvent;
                    if (oe.detail > 0 || oe.deltaY < 0) {
                        if (e.ctrlKey) {
                            this.alcmonavis.decreaseFontSizes();
                        } else if (e.altKey) {
                            this.alcmonavis.zoomOutX(AP.BUTTON_ZOOM_OUT_FACTOR_SLOW);
                        } else {
                            this.alcmonavis.zoomOutY(AP.BUTTON_ZOOM_OUT_FACTOR_SLOW);
                        }
                    } else {
                        if (e.ctrlKey) {
                            this.alcmonavis.increaseFontSizes();
                        } else if (e.altKey) {
                            this.alcmonavis.zoomInX(AP.BUTTON_ZOOM_IN_FACTOR_SLOW);
                        } else {
                            this.alcmonavis.zoomInY(AP.BUTTON_ZOOM_IN_FACTOR_SLOW);
                        }
                    }
                }
                // To prevent page fom scrolling:
                return false;
            }
        });
    }

    // --------------------------------------------------------------
    // Functions to make GUI elements
    // --------------------------------------------------------------

    makeProgramDesc(): HTMLstring {
        var h = '';
        h = h.concat('<div class=' + AP.PROG_NAME + '>');
        h = h.concat(
            '<a class="' +
            AP.PROGNAMELINK +
            '" href="' +
            AP.WEBSITE +
            '" target="alcmonavis.blank">' +
            AP.NAME +
            ' ' +
            AP.VERSION +
            '</a>',
        );
        h = h.concat('</div>');
        return h;
    }

    makePhylogramControl(): HTMLstring {
        var radioGroup = 'phylogram_control_radio';
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat('<div class="' + AP.PHYLOGRAM_CLADOGRAM_CONTROLGROUP + '">');
        h = h.concat(
            this.makeRadioButton(
                'P',
                AP.PHYLOGRAM_BUTTON,
                radioGroup,
                'phylogram display (uses branch length values)  (use Alt+P to cycle between display types)',
            ),
        );
        h = h.concat(
            this.makeRadioButton(
                'A',
                AP.PHYLOGRAM_ALIGNED_BUTTON,
                radioGroup,
                'phylogram display (uses branch length values) with aligned labels  (use Alt+P to cycle between display types)',
            ),
        );
        h = h.concat(
            this.makeRadioButton(
                'C',
                AP.CLADOGRAM_BUTTON,
                radioGroup,
                ' cladogram display (ignores branch length values)  (use Alt+P to cycle between display types)',
            ),
        );
        h = h.concat('</div>');
        h = h.concat('</fieldset>');
        return h;
    }

    makeDisplayControl(): HTMLstring {
        var h = '';

        h = h.concat('<fieldset><legend>Display Data</legend>');
        h = h.concat('<div class="' + AP.DISPLAY_DATA_CONTROLGROUP + '">');
        if (this.alcmonavis.basicTreeProperties) {
            if (this.alcmonavis.basicTreeProperties.nodeNames) {
                h = h.concat(
                    this.makeCheckboxButton(
                        'Node Name',
                        AP.NODE_NAME_CB,
                        'to show/hide node names (node names usually are the untyped labels found in New Hampshire/Newick formatted trees)',
                    ),
                );
            }
            if (this.alcmonavis.basicTreeProperties.taxonomies) {
                h = h.concat(this.makeCheckboxButton('Taxonomy', AP.TAXONOMY_CB, 'to show/hide node taxonomic information'));
            }
            if (this.alcmonavis.basicTreeProperties.sequences) {
                h = h.concat(this.makeCheckboxButton('Sequence', AP.SEQUENCE_CB, 'to show/hide node sequence information'));
            }
            if (this.alcmonavis.basicTreeProperties.confidences) {
                h = h.concat(this.makeCheckboxButton('Confidence', AP.CONFIDENCE_VALUES_CB, 'to show/hide confidence values'));
            }
            if (this.alcmonavis.basicTreeProperties.branchLengths) {
                h = h.concat(
                    this.makeCheckboxButton('Branch Length', AP.BRANCH_LENGTH_VALUES_CB, 'to show/hide branch length values'),
                );
            }
            if (this.alcmonavis.basicTreeProperties.nodeEvents) {
                h = h.concat(
                    this.makeCheckboxButton(
                        'Node Events',
                        AP.NODE_EVENTS_CB,
                        'to show speciations and duplications as colored nodes (e.g. speciations green, duplications red)',
                    ),
                );
            }
            if (this.alcmonavis.basicTreeProperties.branchEvents) {
                h = h.concat(
                    this.makeCheckboxButton('Branch Events', AP.BRANCH_EVENTS_CB, 'to show/hide branch events (e.g. mutations)'),
                );
            }
            h = h.concat(this.makeCheckboxButton('External Labels', AP.EXTERNAL_LABEL_CB, 'to show/hide external node labels'));
            if (this.alcmonavis.basicTreeProperties.internalNodeData) {
                h = h.concat(
                    this.makeCheckboxButton('Internal Labels', AP.INTERNAL_LABEL_CB, 'to show/hide internal node labels'),
                );
            }
        }
        h = h.concat(
            this.makeCheckboxButton(
                'External Nodes',
                AP.EXTERNAL_NODES_CB,
                'to show external nodes as shapes (usually circles)',
            ),
        );
        h = h.concat(
            this.makeCheckboxButton(
                'Internal Nodes',
                AP.INTERNAL_NODES_CB,
                'to show internal nodes as shapes (usually circles)',
            ),
        );
        if (this.alcmonavis.settings) {
            if (this.alcmonavis.settings.showBranchColorsButton) {
                h = h.concat(
                    this.makeCheckboxButton(
                        'Branch Colors',
                        AP.BRANCH_COLORS_CB,
                        'to use/ignore branch colors (if present in tree file)',
                    ),
                );
            }
            if (this.alcmonavis.settings.enableNodeVisualizations) {
                h = h.concat(
                    this.makeCheckboxButton(
                        'Node Vis',
                        AP.NODE_VIS_CB,
                        'to show/hide node visualizations (colors, shapes, sizes), set with the Visualizations sub-menu',
                    ),
                );
            }
            if (this.alcmonavis.settings.enableBranchVisualizations) {
                h = h.concat(
                    this.makeCheckboxButton(
                        'Branch Vis',
                        AP.BRANCH_VIS_CB,
                        'to show/hide branch visualizations, set with the Visualizations sub-menu',
                    ),
                );
            }
            if (this.alcmonavis.settings.showDynahideButton) {
                h = h.concat(
                    this.makeCheckboxButton('Dyna Hide', AP.DYNAHIDE_CB, 'to hide external labels depending on expected visibility'),
                );
            }
            if (this.alcmonavis.settings.showShortenNodeNamesButton) {
                h = h.concat(this.makeCheckboxButton('Short Names', AP.SHORTEN_NODE_NAME_CB, 'to shorten long node names'));
            }
        }
        h = h.concat('</div>');
        h = h.concat('</fieldset>');
        return h;
    }

    makeZoomControl(): HTMLstring {
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat('<legend>Zoom</legend>');
        h = h.concat(this.makeButton('Y+', AP.ZOOM_IN_Y, 'zoom in vertically (Alt+Up or Shift+mousewheel)'));
        h = h.concat('<br>');
        h = h.concat(this.makeButton('X-', AP.ZOOM_OUT_X, 'zoom out horizontally (Alt+Left or Shift+Alt+mousewheel)'));
        h = h.concat(
            this.makeButton(
                'F',
                AP.ZOOM_TO_FIT,
                'fit and center tree display (Alt+C, Home, or Esc to re-position controls as well)',
            ),
        );
        h = h.concat(this.makeButton('X+', AP.ZOOM_IN_X, 'zoom in horizontally (Alt+Right or Shift+Alt+mousewheel)'));
        h = h.concat('<br>');
        h = h.concat(this.makeButton('Y-', AP.ZOOM_OUT_Y, 'zoom out vertically (Alt+Down or Shift+mousewheel)'));
        h = h.concat('</fieldset>');
        return h;
    }

    makeControlButtons(): HTMLstring {
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat('<legend>Tools</legend>');
        h = h.concat('<div>');
        h = h.concat(this.makeButton('O', AP.ORDER_BUTTON, 'order all (Alt+O)'));
        h = h.concat(this.makeButton('R', AP.RETURN_TO_SUPERTREE_BUTTON, 'return to the supertree (if in subtree) (Alt+R)'));
        h = h.concat('<br>');
        h = h.concat(this.makeButton('U', AP.UNCOLLAPSE_ALL_BUTTON, 'uncollapse all (Alt+U)'));
        h = h.concat(this.makeButton('M', AP.MIDPOINT_ROOT_BUTTON, 'midpoint re-root (Alt+M)'));
        h = h.concat('</div>');
        h = h.concat('</fieldset>');
        return h;
    }

    makeDownloadSection(): HTMLstring {
        var h = '';
        h = h.concat('<form action="#">');
        h = h.concat('<fieldset>');
        h = h.concat(
            '<input type="button" value="Download" name="' +
            AP.DOWNLOAD_BUTTON +
            '" title="download/export tree in a selected format" id="' +
            AP.DOWNLOAD_BUTTON +
            '">',
        ); // BM ??
        h = h.concat('<br>');
        h = h.concat('<select name="' + AP.EXPORT_FORMAT_SELECT + '" id="' + AP.EXPORT_FORMAT_SELECT + '">');
        h = h.concat('<option value="' + AP.PNG_EXPORT_FORMAT + '">' + AP.PNG_EXPORT_FORMAT + '</option>');
        h = h.concat('<option value="' + AP.SVG_EXPORT_FORMAT + '">' + AP.SVG_EXPORT_FORMAT + '</option>');
        h = h.concat('<option value="' + AP.PHYLOXML_EXPORT_FORMAT + '">' + AP.PHYLOXML_EXPORT_FORMAT + '</option>');
        h = h.concat('<option value="' + AP.NH_EXPORT_FORMAT + '">' + AP.NH_EXPORT_FORMAT + '</option>');
        // h = h.concat('<option value="' + AP.PDF_EXPORT_FORMAT + '">' + AP.PDF_EXPORT_FORMAT + '</option>');
        h = h.concat('</select>');
        h = h.concat('</fieldset>');
        h = h.concat('</form>');
        return h;
    }

    makeSliders(): HTMLstring {
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat(this.makeSlider('External label size:', AP.EXTERNAL_FONT_SIZE_SLIDER));
        if (this.alcmonavis.basicTreeProperties && this.alcmonavis.basicTreeProperties.internalNodeData) {
            h = h.concat(this.makeSlider('Internal label size:', AP.INTERNAL_FONT_SIZE_SLIDER));
        }
        if (
            this.alcmonavis.basicTreeProperties &&
            (this.alcmonavis.basicTreeProperties.branchLengths ||
                this.alcmonavis.basicTreeProperties.confidences ||
                this.alcmonavis.basicTreeProperties.branchEvents)
        ) {
            h = h.concat(this.makeSlider('Branch label size:', AP.BRANCH_DATA_FONT_SIZE_SLIDER));
        }
        h = h.concat(this.makeSlider('Node size:', AP.NODE_SIZE_SLIDER));
        h = h.concat(this.makeSlider('Branch width:', AP.BRANCH_WIDTH_SLIDER));
        h = h.concat('</fieldset>');
        return h;
    }

    makeAutoCollapse(): HTMLstring {
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat('<legend>Collapse Depth</legend>');
        h = h.concat(
            this.makeButton('-', AP.DECR_DEPTH_COLLAPSE_LEVEL, 'to decrease the depth threshold (wraps around) (Alt+A)'),
        );
        h = h.concat(this.makeTextInput(AP.DEPTH_COLLAPSE_LABEL, 'the current depth threshold'));
        h = h.concat(
            this.makeButton('+', AP.INCR_DEPTH_COLLAPSE_LEVEL, 'to increase the depth threshold (wraps around) (Alt+S)'),
        );
        h = h.concat('</fieldset>');
        if (
            this.alcmonavis.settings &&
            this.alcmonavis.basicTreeProperties &&
            this.alcmonavis.settings.enableCollapseByBranchLenghts &&
            this.alcmonavis.basicTreeProperties.branchLengths
        ) {
            h = h.concat('<fieldset>');
            h = h.concat('<legend>Collapse Length</legend>');
            h = h.concat(
                this.makeButton(
                    '-',
                    AP.DECR_BL_COLLAPSE_LEVEL,
                    'to decrease the maximal subtree branch length threshold (wraps around)',
                ),
            );
            h = h.concat(this.makeTextInput(AP.BL_COLLAPSE_LABEL, 'the current maximal subtree branch length threshold'));
            h = h.concat(
                this.makeButton(
                    '+',
                    AP.INCR_BL_COLLAPSE_LEVEL,
                    'to increase the maximal subtree branch length threshold (wraps around)',
                ),
            );
            h = h.concat('</fieldset>');
        }

        if (this.settings.enableCollapseByFeature) {
            h = h.concat('<fieldset>');
            h = h.concat('<legend>Collapse Feature</legend>');
            h = h.concat(
                '<select name="' + AP.COLLAPSE_BY_FEATURE_SELECT + '" id="' + AP.COLLAPSE_BY_FEATURE_SELECT + '">',
            );
            h = h.concat('<option value="' + AP.OFF_FEATURE + '">' + AP.OFF_FEATURE + '</option>');
            if (this.alcmonavis.basicTreeProperties && this.alcmonavis.basicTreeProperties.taxonomies) {
                h = h.concat('<option value="' + AP.SPECIES_FEATURE + '">' + AP.SPECIES_FEATURE + '</option>');
            }
            var refs = this.alcmonavis.getPropertyRefs();
            if (refs) {
                refs.forEach((v) => {
                    var label = v;
                    label = label.replace(/^.+:/, '');
                    if (
                        this.alcmonavis.settings &&
                        (!this.alcmonavis.settings.propertiesToIgnoreForNodeVisualization ||
                            this.alcmonavis.settings.propertiesToIgnoreForNodeVisualization.indexOf(label) < 0)
                    ) {
                        if (label.length > AP.MAX_LENGTH_FOR_COLLAPSE_BY_FEATURE_LABEL + 2) {
                            label = label.substring(0, AP.MAX_LENGTH_FOR_COLLAPSE_BY_FEATURE_LABEL) + '..';
                        }
                        h = h.concat('<option value="' + v + '">' + label + '</option>');
                    }
                });
            }
            h = h.concat('</select>');
            h = h.concat('</fieldset>');
        }
        return h;
    }

    // --------------------------------------------------------------
    // Functions to make search-related elements
    // --------------------------------------------------------------
    makeSearchBoxes(): HTMLstring {
        var tooltip =
            "enter text to search for (use ',' for logical OR and '+' for logical AND," +
            ' use expressions in form of XX:term for typed search -- e.g. NN:node name, TC:taxonomy code,' +
            ' TS:taxonomy scientific name, SN:sequence name, GN:gene name, SS:sequence symbol, MS:molecular sequence, ...)';
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat('<legend>Search</legend>');
        h = h.concat(this.makeTextInput(AP.SEARCH_FIELD_0, tooltip));
        h = h.concat(this.makeButton('R', AP.RESET_SEARCH_A_BTN, AP.RESET_SEARCH_A_BTN_TOOLTIP));
        h = h.concat('<br>');
        h = h.concat(this.makeTextInput(AP.SEARCH_FIELD_1, tooltip));
        h = h.concat(this.makeButton('R', AP.RESET_SEARCH_B_BTN, AP.RESET_SEARCH_B_BTN_TOOLTIP));
        h = h.concat('<br>');
        h = h.concat(this.makeSearchControls());
        h = h.concat('</fieldset>');
        return h;
    }

    makeSearchControls(): HTMLstring {
        var h = '';
        h = h.concat('<div class="' + AP.SEARCH_OPTIONS_GROUP + '">');
        h = h.concat(
            this.makeCheckboxButton('Cas', AP.SEARCH_OPTIONS_CASE_SENSITIVE_CB, 'to search in a case-sensitive manner'),
        );
        h = h.concat(
            this.makeCheckboxButton(
                'Wrd',
                AP.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB,
                ' to match complete terms (separated by spaces or underscores) only (does not apply to regular expression search)',
            ),
        );
        h = h.concat('</div>');
        h = h.concat('<br>');
        h = h.concat('<div class="' + AP.SEARCH_OPTIONS_GROUP + '">');
        h = h.concat(this.makeCheckboxButton('Neg', AP.SEARCH_OPTIONS_NEGATE_RES_CB, 'to invert (negate) the search results'));
        h = h.concat(this.makeCheckboxButton('Reg', AP.SEARCH_OPTIONS_REGEX_CB, 'to search with regular expressions'));
        h = h.concat('</div>');
        return h;
    }

    makeSearchControlsCompact(): HTMLstring {
        var h = '';
        h = h.concat('<div class="' + AP.SEARCH_OPTIONS_GROUP + '">');
        h = h.concat(
            this.makeCheckboxButton('C', AP.SEARCH_OPTIONS_CASE_SENSITIVE_CB, 'to search in a case-sensitive manner'),
        );
        h = h.concat(
            this.makeCheckboxButton(
                'W',
                AP.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB,
                ' to match complete terms (separated by spaces or underscores) only (does not apply to regular expression search)',
            ),
        );
        h = h.concat(this.makeCheckboxButton('N', AP.SEARCH_OPTIONS_NEGATE_RES_CB, 'to invert (negate) the search results'));
        h = h.concat(this.makeCheckboxButton('R', AP.SEARCH_OPTIONS_REGEX_CB, 'to search with regular expressions'));
        h = h.concat('</div>');
        return h;
    }

    // --------------------------------------------------------------
    // Functions to make visualization controls
    // --------------------------------------------------------------
    makeVisualControls(): HTMLstring {
        var h = '';
        h = h.concat('<form action="#">');
        h = h.concat('<fieldset>');
        h = h.concat('<legend>Visualizations</legend>');
        h = h.concat(
            this.makeSelectMenu(
                'Label Color:',
                '<br>',
                AP.LABEL_COLOR_SELECT_MENU,
                'colorize the node label according to a property',
            ),
        );
        h = h.concat('<br>');
        h = h.concat(
            this.makeSelectMenu(
                'Node Fill Color:',
                '<br>',
                AP.NODE_FILL_COLOR_SELECT_MENU,
                'colorize the node fill according to a property',
            ),
        );
        h = h.concat('<br>');
        //  h = h.concat(makeSelectMenu('Node Border Color:', '<br>', NODE_BORDER_COLOR_SELECT_MENU, 'colorize the node border according to a property'));
        //  h = h.concat('<br>');
        h = h.concat(
            this.makeSelectMenu(
                'Node Shape:',
                '<br>',
                AP.NODE_SHAPE_SELECT_MENU,
                'change the node shape according to a property',
            ),
        );
        h = h.concat('<br>');
        h = h.concat(
            this.makeSelectMenu('Node Size:', '<br>', AP.NODE_SIZE_SELECT_MENU, 'change the node size according to a property'),
        );
        h = h.concat('</fieldset>');
        h = h.concat('</form>');
        return h;
    }

    makeVisualization2(title: string): HTMLstring {
        //~~
        var h = '';
        h = h.concat('<form action="#">');
        h = h.concat('<fieldset>');
        h = h.concat('<legend>' + title + '</legend>');
        h = h.concat(
            this.makeSelectMenu(
                'Label Color:',
                '<br>',
                AP.LABEL_COLOR_SELECT_MENU_2,
                'colorize the node label according to a property',
            ),
        );
        h = h.concat('<br>');
        h = h.concat(
            this.makeSelectMenu(
                'Node Fill Color:',
                '<br>',
                AP.NODE_FILL_COLOR_SELECT_MENU_2,
                'colorize the node fill according to a property',
            ),
        );
        //  h = h.concat('<br>');
        // h = h.concat(makeSelectMenu('Node Border Color:', '<br>', NODE_BORDER_COLOR_SELECT_MENU_2, 'colorize the node border according to a property'));
        h = h.concat('</fieldset>');
        h = h.concat('</form>');
        return h;
    }

    makeVisualization3(title: string): HTMLstring {
        //~~~
        var h = '';
        h = h.concat('<form action="#">');
        h = h.concat('<fieldset>');
        h = h.concat('<legend>' + title + '</legend>');
        h = h.concat(
            this.makeSelectMenu(
                'Label Color:',
                '<br>',
                AP.LABEL_COLOR_SELECT_MENU_3,
                'colorize the node label according to a property',
            ),
        );
        h = h.concat('<br>');
        h = h.concat(
            this.makeSelectMenu(
                'Node Fill Color:',
                '<br>',
                AP.NODE_FILL_COLOR_SELECT_MENU_3,
                'colorize the node fill according to a property',
            ),
        );
        // h = h.concat('<br>');
        // h = h.concat(makeSelectMenu('Node Border Color:', '<br>', NODE_BORDER_COLOR_SELECT_MENU_3, 'colorize the node border according to a property'));
        h = h.concat('</fieldset>');
        h = h.concat('</form>');
        return h;
    }

    makeMsaResidueVisCurrResPositionControl(): HTMLstring {
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat('<legend>MSA Residue Pos.</legend>');
        h = h.concat(this.makeSlider(null, AP.MSA_RESIDUE_VIS_CURR_RES_POS_SLIDER_1));
        h = h.concat(
            this.makeButton(
                '-',
                AP.MSA_RESIDUE_VIS_DECR_CURR_RES_POS_BTN,
                'to decrease current MSA residue position by 1 (wraps around) (Alt+[)',
            ),
        );
        h = h.concat(this.makeTextInput(AP.MSA_RESIDUE_VIS_CURR_RES_POS_LABEL, 'the current MSA residue position'));
        h = h.concat(
            this.makeButton(
                '+',
                AP.MSA_RESIDUE_VIS_INCR_CURR_RES_POS_BTN,
                'to increase current MSA residue position by 1 (wraps around) (Alt+])',
            ),
        );
        h = h.concat('</fieldset>');
        return h;
    }

    makeLegendControl(): HTMLstring {
        var mouseTip =
            ' (alternatively, place legend with mouse using shift+left-mouse-button click, or alt+left-mouse-button click)';
        var h = '';
        h = h.concat('<fieldset>');
        h = h.concat('<legend>Vis Legend</legend>');
        h = h.concat(this.makeButton('Show', AP.LEGENDS_SHOW_BTN, 'to show/hide legend(s)'));
        h = h.concat(
            this.makeButton(
                'Dir',
                AP.LEGENDS_HORIZ_VERT_BTN,
                'to toggle between vertical and horizontal alignment of (multiple) legends',
            ),
        );
        h = h.concat('<br>');
        h = h.concat(this.makeButton('^', AP.LEGENDS_MOVE_UP_BTN, 'move legend(s) up' + mouseTip));
        h = h.concat('<br>');
        h = h.concat(this.makeButton('<', AP.LEGENDS_MOVE_LEFT_BTN, 'move legend(s) left' + mouseTip));
        h = h.concat(this.makeButton('R', AP.LEGENDS_RESET_BTN, 'return legend(s) to original position' + mouseTip));
        h = h.concat(this.makeButton('>', AP.LEGENDS_MOVE_RIGHT_BTN, 'move legend(s) right' + mouseTip));
        h = h.concat('<br>');
        h = h.concat(this.makeButton('v', AP.LEGENDS_MOVE_DOWN_BTN, 'move legend(s) down' + mouseTip));
        h = h.concat('</fieldset>');
        return h;
    }

    // --------------------------------------------------------------
    // Functions to make individual GUI components
    // --------------------------------------------------------------
    makeButton(label: string, id: string, tooltip: string): HTMLstring {
        return '<input type="button" value="' + label + '" name="' + id + '" id="' + id + '" title="' + tooltip + '">';
    }

    makeCheckboxButton(label: string, id: string, tooltip: string): HTMLstring {
        return (
            '<label for="' +
            id +
            '" title="' +
            tooltip +
            '">' +
            label +
            '</label><input type="checkbox" name="' +
            id +
            '" id="' +
            id +
            '">'
        );
    }

    makeRadioButton(label: string, id: string, radioGroup: string, tooltip: string): HTMLstring {
        return (
            '<label for="' +
            id +
            '" title="' +
            tooltip +
            '">' +
            label +
            '</label><input type="radio" name="' +
            radioGroup +
            '" id="' +
            id +
            '">'
        );
    }

    makeSelectMenu(label: string, sep: string, id: string, tooltip: string): HTMLstring {
        return (
            '<label for="' +
            id +
            '" title="' +
            tooltip +
            '">' +
            label +
            '</label>' +
            sep +
            '<select name="' +
            id +
            '" id="' +
            id +
            '"></select>'
        );
    }

    makeSlider(label: string | null | undefined, id: string): HTMLstring {
        if (label) {
            return label + '<div id="' + id + '"></div>';
        }
        return '<div id="' + id + '"></div>';
    }

    makeTextInput(id: string, tooltip: string): HTMLstring {
        return '<input title="' + tooltip + '" type="text" name="' + id + '" id="' + id + '">';
    }

    makeTextInputWithLabel(label: string, sep: string, id: string, tooltip: string): HTMLstring {
        return label + sep + '<input title="' + tooltip + '" type="text" name="' + id + '" id="' + id + '">';
    }

    setCheckboxValue = (id: string, value: boolean) => {
        var cb = $<HTMLInputElement>('#' + id);
        if (cb && cb[0]) {
            cb[0].checked = value;
            cb.button('refresh');
        }
    };

    setRadioButtonValue = (id: string, value: boolean) => {
        var radio = $<HTMLInputElement>('input#' + id); // BM
        if (radio) {
            radio[0].checked = value;
            radio.button('refresh');
        }
    };

    disableCheckbox = (cb: string) => {
        if (cb) {
            var b = $<HTMLInputElement>(cb);
            if (b) {
                b.checkboxradio({
                    disabled: true,
                });
            }
        }
    };

    initializeGui = () => {
        if (!OptionsDeclared(this.options)) throw 'Options not set';
        this.setDisplayTypeButtons();

        this.setCheckboxValue(AP.NODE_NAME_CB, this.options.showNodeName);
        this.setCheckboxValue(AP.TAXONOMY_CB, this.options.showTaxonomy);
        this.setCheckboxValue(AP.SEQUENCE_CB, this.options.showSequence);
        this.setCheckboxValue(AP.CONFIDENCE_VALUES_CB, this.options.showConfidenceValues);
        this.setCheckboxValue(AP.BRANCH_LENGTH_VALUES_CB, this.options.showBranchLengthValues);
        this.setCheckboxValue(AP.NODE_EVENTS_CB, this.options.showNodeEvents);
        this.setCheckboxValue(AP.BRANCH_EVENTS_CB, this.options.showBranchEvents);
        this.setCheckboxValue(AP.INTERNAL_LABEL_CB, this.options.showInternalLabels);
        this.setCheckboxValue(AP.EXTERNAL_LABEL_CB, this.options.showExternalLabels);
        this.setCheckboxValue(AP.INTERNAL_NODES_CB, this.options.showInternalNodes);
        this.setCheckboxValue(AP.EXTERNAL_NODES_CB, this.options.showExternalNodes);
        this.setCheckboxValue(AP.BRANCH_COLORS_CB, this.options.showBranchColors);
        this.setCheckboxValue(AP.NODE_VIS_CB, this.options.showNodeVisualizations);
        this.setCheckboxValue(AP.BRANCH_VIS_CB, this.options.showBranchVisualizations);
        this.setCheckboxValue(AP.DYNAHIDE_CB, this.options.dynahide);
        this.setCheckboxValue(AP.SHORTEN_NODE_NAME_CB, this.options.shortenNodeNames);
        this.initializeVisualizationMenu();
        this.initializeSearchOptions();
        //this.makeBackground();
    };

    setDisplayTypeButtons = () => {
        if (!OptionsDeclared(this.options)) throw 'Options not set';

        this.setRadioButtonValue(AP.PHYLOGRAM_BUTTON, this.options.phylogram && !this.options.alignPhylogram);
        this.setRadioButtonValue(AP.CLADOGRAM_BUTTON, !this.options.phylogram && !this.options.alignPhylogram);
        this.setRadioButtonValue(AP.PHYLOGRAM_ALIGNED_BUTTON, this.options.alignPhylogram && this.options.phylogram);
        if (!(this.alcmonavis.basicTreeProperties && this.alcmonavis.basicTreeProperties.branchLengths)) {
            this.disableCheckbox('#' + AP.PHYLOGRAM_BUTTON);
            this.disableCheckbox('#' + AP.PHYLOGRAM_ALIGNED_BUTTON);
        }
    };

    initializeVisualizationMenu = () => {
        $('select#' + AP.NODE_FILL_COLOR_SELECT_MENU).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU).append($('<option>').val(AP.NONE).html('none'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU).append($('<option>').val(AP.SAME_AS_FILL).html('same as fill'));

        $('select#' + AP.NODE_SHAPE_SELECT_MENU).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.NODE_SIZE_SELECT_MENU).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.LABEL_COLOR_SELECT_MENU).append($('<option>').val(AP.DEFAULT).html('default'));

        //~~
        $('select#' + AP.NODE_FILL_COLOR_SELECT_MENU_2).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_2).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_2).append($('<option>').val(AP.NONE).html('none'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_2).append($('<option>').val(AP.SAME_AS_FILL).html('same as fill'));

        $('select#' + AP.LABEL_COLOR_SELECT_MENU_2).append($('<option>').val(AP.DEFAULT).html('default'));

        //

        //~~
        $('select#' + AP.NODE_FILL_COLOR_SELECT_MENU_3).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_3).append($('<option>').val(AP.DEFAULT).html('default'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_3).append($('<option>').val(AP.NONE).html('none'));
        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_3).append($('<option>').val(AP.SAME_AS_FILL).html('same as fill'));

        $('select#' + AP.LABEL_COLOR_SELECT_MENU_3).append($('<option>').val(AP.DEFAULT).html('default'));

        //

        if (this.alcmonavis.visualizations) {
            if (this.alcmonavis.visualizations.labelColor) {
                for (var key in this.alcmonavis.visualizations.labelColor) {
                    if (this.alcmonavis.visualizations.labelColor.hasOwnProperty(key)) {
                        $('select#' + AP.LABEL_COLOR_SELECT_MENU).append($('<option>').val(key).html(key));
                    }
                }
            }
            if (this.alcmonavis.visualizations.nodeShape) {
                for (var key in this.alcmonavis.visualizations.nodeShape) {
                    if (this.alcmonavis.visualizations.nodeShape.hasOwnProperty(key)) {
                        $('select#' + AP.NODE_SHAPE_SELECT_MENU).append($('<option>').val(key).html(key));
                    }
                }
            }
            if (this.alcmonavis.visualizations.nodeFillColor) {
                for (var key in this.alcmonavis.visualizations.nodeFillColor) {
                    if (this.alcmonavis.visualizations.nodeFillColor.hasOwnProperty(key)) {
                        $('select#' + AP.NODE_FILL_COLOR_SELECT_MENU).append($('<option>').val(key).html(key));
                    }
                }
            }
            if (this.alcmonavis.visualizations.nodeBorderColor) {
                for (var key in this.alcmonavis.visualizations.nodeBorderColor) {
                    if (this.alcmonavis.visualizations.nodeBorderColor.hasOwnProperty(key)) {
                        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU).append($('<option>').val(key).html(key));
                    }
                }
            }
            if (this.alcmonavis.visualizations.nodeSize) {
                for (var key in this.alcmonavis.visualizations.nodeSize) {
                    if (this.alcmonavis.visualizations.nodeSize.hasOwnProperty(key)) {
                        $('select#' + AP.NODE_SIZE_SELECT_MENU).append($('<option>').val(key).html(key));
                    }
                }
            }
        }

        if (this.alcmonavis.specialVisualizations != null) {
            //~~
            if ('Mutations' in this.alcmonavis.specialVisualizations) {
                const mutations = this.alcmonavis.specialVisualizations['Mutations'];
                if (mutations != null && mutations.property_values != null) {
                    const properties = mutations.property_values;
                    const arrayLength = properties.length;
                    for (var i = 0; i < arrayLength; i++) {
                        const key = properties[i];
                        $('select#' + AP.LABEL_COLOR_SELECT_MENU_2).append($('<option>').val(key).html(key));
                        $('select#' + AP.NODE_FILL_COLOR_SELECT_MENU_2).append($('<option>').val(key).html(key));
                        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_2).append($('<option>').val(key).html(key));
                    }
                }
            }

            if ('Convergent_Mutations' in this.alcmonavis.specialVisualizations) {
                const conv_mutations = this.alcmonavis.specialVisualizations['Convergent_Mutations'];

                if (conv_mutations != null && conv_mutations.property_values != null) {
                    const properties = conv_mutations.property_values;
                    const arrayLength = properties.length;
                    for (var i = 0; i < arrayLength; i++) {
                        const key = properties[i];
                        $('select#' + AP.LABEL_COLOR_SELECT_MENU_3).append($('<option>').val(key).html(key));
                        $('select#' + AP.NODE_FILL_COLOR_SELECT_MENU_3).append($('<option>').val(key).html(key));
                        $('select#' + AP.NODE_BORDER_COLOR_SELECT_MENU_3).append($('<option>').val(key).html(key));
                    }
                }
            }
        }

        $('#' + AP.MSA_RESIDUE_VIS_CURR_RES_POS_SLIDER_1).slider({
            min: 1,
            max: (this.alcmonavis.basicTreeProperties && this.alcmonavis.basicTreeProperties.maxMolSeqLength) || 1,
            step: 1,
            value: 1,
            animate: 'fast',
            slide: this.alcmonavis.updateMsaResidueVisCurrResPosFromSlider,
            change: this.alcmonavis.updateMsaResidueVisCurrResPosFromSlider,
        });
    };

    initializeSearchOptions() {
        if (!OptionsDeclared(this.options)) throw 'Options not set';

        if (this.options.searchUsesRegex === true) {
            this.options.searchIsPartial = true;
        }
        if (this.options.searchIsPartial === false) {
            this.options.searchUsesRegex = false;
        }
        this.options.searchNegateResult = false;
        this.setCheckboxValue(AP.SEARCH_OPTIONS_CASE_SENSITIVE_CB, this.options.searchIsCaseSensitive);
        this.setCheckboxValue(AP.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB, !this.options.searchIsPartial);
        this.setCheckboxValue(AP.SEARCH_OPTIONS_REGEX_CB, this.options.searchUsesRegex);
        this.setCheckboxValue(AP.SEARCH_OPTIONS_NEGATE_RES_CB, this.options.searchNegateResult);

        if (this.options.searchAinitialValue) {
            $('#' + AP.SEARCH_FIELD_0).val(this.options.searchAinitialValue);
        }
        if (this.options.searchBinitialValue) {
            $('#' + AP.SEARCH_FIELD_1).val(this.options.searchBinitialValue);
        }
    }
}

