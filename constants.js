"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.category50c = exports.category50b = exports.category50 = exports.col_category50c = exports.col_category50b = exports.col_category50 = exports.RE_UNIPROTKB = exports.RE_REFSEQ = exports.RE_GENBANK_NUC = exports.RE_GENBANK_PROT = exports.RE_SWISSPROT_TREMBL_PFAM = exports.RE_SWISSPROT_TREMBL = exports.VK_CLOSE_BRACKET = exports.VK_OPEN_BRACKET = exports.VK_PAGE_DOWN = exports.VK_PAGE_UP = exports.VK_MINUS_N = exports.VK_PLUS_N = exports.VK_MINUS = exports.VK_PLUS = exports.VK_RIGHT = exports.VK_LEFT = exports.VK_DOWN = exports.VK_UP = exports.VK_HOME = exports.VK_BACKSPACE = exports.VK_DELETE = exports.VK_9_NUMPAD = exports.VK_0_NUMPAD = exports.VK_9 = exports.VK_0 = exports.VK_U = exports.VK_S = exports.VK_R = exports.VK_P = exports.VK_O = exports.VK_M = exports.VK_L = exports.VK_C = exports.VK_A = exports.VK_ESC = exports.NODE_BORDER_COLOR_SELECT_MENU_3 = exports.NODE_FILL_COLOR_SELECT_MENU_3 = exports.LABEL_COLOR_SELECT_MENU_3 = exports.NODE_BORDER_COLOR_SELECT_MENU_2 = exports.NODE_FILL_COLOR_SELECT_MENU_2 = exports.LABEL_COLOR_SELECT_MENU_2 = exports.ZOOM_TO_FIT = exports.ZOOM_OUT_Y = exports.ZOOM_OUT_X = exports.ZOOM_IN_Y = exports.ZOOM_IN_X = exports.UNCOLLAPSE_ALL_BUTTON = exports.TAXONOMY_CB = exports.SHORTEN_NODE_NAME_CB = exports.SEQUENCE_CB = exports.SEARCH_OPTIONS_REGEX_CB = exports.SEARCH_OPTIONS_NEGATE_RES_CB = exports.SEARCH_OPTIONS_GROUP = exports.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB = exports.SEARCH_OPTIONS_CASE_SENSITIVE_CB = exports.SEARCH_FIELD_1 = exports.SEARCH_FIELD_0 = exports.RETURN_TO_SUPERTREE_BUTTON = exports.RESET_SEARCH_B_BTN = exports.RESET_SEARCH_A_BTN = exports.PROGNAMELINK = exports.PROG_NAME = exports.PHYLOGRAM_CLADOGRAM_CONTROLGROUP = exports.PHYLOGRAM_BUTTON = exports.PHYLOGRAM_ALIGNED_BUTTON = exports.ORDER_BUTTON = exports.NODE_VIS_CB = exports.NODE_SIZE_SLIDER = exports.NODE_SIZE_SELECT_MENU = exports.NODE_SHAPE_SELECT_MENU = exports.NODE_NAME_CB = exports.NODE_FILL_COLOR_SELECT_MENU = exports.NODE_EVENTS_CB = exports.NODE_DATA = exports.NODE_BORDER_COLOR_SELECT_MENU = exports.MSA_RESIDUE_VIS_INCR_CURR_RES_POS_BTN = exports.MSA_RESIDUE_VIS_DECR_CURR_RES_POS_BTN = exports.MSA_RESIDUE_VIS_CURR_RES_POS_SLIDER_1 = exports.MSA_RESIDUE_VIS_CURR_RES_POS_LABEL = exports.MIDPOINT_ROOT_BUTTON = exports.LEGENDS_SHOW_BTN = exports.LEGENDS_RESET_BTN = exports.LEGENDS_MOVE_UP_BTN = exports.LEGENDS_MOVE_RIGHT_BTN = exports.LEGENDS_MOVE_LEFT_BTN = exports.LEGENDS_MOVE_DOWN_BTN = exports.LEGENDS_HORIZ_VERT_BTN = exports.LEGEND_LABEL = exports.LEGEND_DESCRIPTION = exports.LEGEND = exports.LABEL_COLOR_SELECT_MENU = exports.INTERNAL_NODES_CB = exports.INTERNAL_LABEL_CB = exports.INTERNAL_FONT_SIZE_SLIDER = exports.INCR_DEPTH_COLLAPSE_LEVEL = exports.INCR_BL_COLLAPSE_LEVEL = exports.EXTERNAL_NODES_CB = exports.EXTERNAL_LABEL_CB = exports.EXTERNAL_FONT_SIZE_SLIDER = exports.EXPORT_FORMAT_SELECT = exports.DYNAHIDE_CB = exports.DOWNLOAD_BUTTON = exports.DISPLAY_DATA_CONTROLGROUP = exports.DEPTH_COLLAPSE_LABEL = exports.DECR_DEPTH_COLLAPSE_LEVEL = exports.DECR_BL_COLLAPSE_LEVEL = exports.CONTROLS_1 = exports.CONTROLS_0 = exports.CONFIDENCE_VALUES_CB = exports.COLOR_PICKER_LABEL = exports.COLOR_PICKER = exports.COLLAPSE_BY_FEATURE_SELECT = exports.CLADOGRAM_BUTTON = exports.BRANCH_WIDTH_SLIDER = exports.BRANCH_VIS_CB = exports.BRANCH_LENGTH_VALUES_CB = exports.BRANCH_EVENTS_CB = exports.BRANCH_DATA_FONT_SIZE_SLIDER = exports.BRANCH_COLORS_CB = exports.BL_COLLAPSE_LABEL = exports.BASE_BACKGROUND = exports.ZOOM_INTERVAL = exports.WIDTH_OFFSET = exports.ERROR = exports.MESSAGE = exports.WARNING = exports.TRANSITION_DURATION_DEFAULT = exports.TOP_AND_BOTTOM_BORDER_HEIGHT = exports.SVG_EXPORT_FORMAT = exports.SPECIES_FEATURE = exports.SPECIATION_COLOR = exports.SLIDER_STEP = exports.SHORTEN_NAME_MAX_LENGTH = exports.SAME_AS_FILL = exports.RESET_SEARCH_B_BTN_TOOLTIP = exports.RESET_SEARCH_A_BTN_TOOLTIP = exports.MSA_RESIDUE = exports.PNG_EXPORT_FORMAT = exports.PHYLOXML_EXPORT_FORMAT = exports.PDF_EXPORT_FORMAT = exports.ORDINAL_SCALE = exports.OFF_FEATURE = exports.NONE = exports.NODE_TOOLTIP_TEXT_COLOR = exports.NODE_TOOLTIP_TEXT_ACTIVE_COLOR = exports.NODE_TOOLTIP_BACKGROUND_COLOR = exports.NODE_SIZE_MIN = exports.NODE_SIZE_MAX = exports.HEIGHT_OFFSET = exports.NH_EXPORT_FORMAT = exports.MOVE_INTERVAL = exports.MAX_LENGTH_FOR_COLLAPSE_BY_FEATURE_LABEL = exports.LINEAR_SCALE = exports.LEGEND_NODE_SIZE = exports.LEGEND_NODE_SHAPE = exports.LEGEND_NODE_FILL_COLOR = exports.LEGEND_NODE_BORDER_COLOR = exports.LEGEND_LABEL_COLOR = exports.LABEL_SIZE_CALC_FACTOR = exports.LABEL_SIZE_CALC_ADDITION = exports.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL = exports.FONT_SIZE_MIN = exports.FONT_SIZE_MAX = exports.DUPLICATION_COLOR = exports.DUPLICATION_AND_SPECIATION_COLOR_COLOR = exports.DEFAULT = exports.CONFIDENCE_VALUE_DIGITS_DEFAULT = exports.COLOR_PICKER_CLICKED_ORIG_COLOR_BORDER_COLOR = exports.COLOR_PICKER_BACKGROUND_BORDER_COLOR = exports.COLOR_FOR_ACTIVE_ELEMENTS = exports.BUTTON_ZOOM_OUT_FACTOR_SLOW = exports.BUTTON_ZOOM_OUT_FACTOR = exports.BUTTON_ZOOM_IN_FACTOR_SLOW = exports.BUTTON_ZOOM_IN_FACTOR = exports.BRANCH_WIDTH_MIN = exports.BRANCH_WIDTH_MAX = exports.BRANCH_LENGTH_DIGITS_DEFAULT = exports.BRANCH_EVENT_REF = exports.BRANCH_EVENT_DATATYPE = exports.BRANCH_EVENT_APPLIES_TO = exports.ACC_TREMBL = exports.ACC_SWISSPROT = exports.ACC_UNIPROTKB = exports.ACC_UNIPROT = exports.ACC_REFSEQ = exports.ACC_GENBANK = exports.TEXT_INPUT_FIELD_DEFAULT_HEIGHT = exports.SEARCH_FIELD_WIDTH_DEFAULT = exports.ROOTOFFSET_DEFAULT = exports.MOLSEQ_FONT_DEFAULTS = exports.DISPLAY_WIDTH_DEFAULT = exports.DISPLY_HEIGHT_DEFAULT = exports.CONTROLS_FONT_SIZE_DEFAULT = exports.CONTROLS_FONT_DEFAULTS = exports.CONTROLS_FONT_COLOR_DEFAULT = exports.CONTROLS_BACKGROUND_COLOR_DEFAULT = exports.CONTROLS_1_WIDTH_DEFAULT = exports.CONTROLS_1_TOP_DEFAULT = exports.CONTROLS_0_TOP_DEFAULT = exports.CONTROLS_0_LEFT_DEFAULT = exports.COLLAPSE_LABEL_WIDTH_DEFAULT = exports.VISUALIZATIONS_LEGEND_YPOS_DEFAULT = exports.VISUALIZATIONS_LEGEND_XPOS_DEFAULT = exports.VISUALIZATIONS_LEGEND_ORIENTATION_DEFAULT = exports.NODE_VISUALIZATIONS_OPACITY_DEFAULT = exports.NODE_SIZE_DEFAULT_DEFAULT = exports.NODE_LABEL_GAP_DEFAULT = exports.NAME_FOR_SVG_DOWNLOAD_DEFAULT = exports.NAME_FOR_PNG_DOWNLOAD_DEFAULT = exports.NAME_FOR_PHYLOXML_DOWNLOAD_DEFAULT = exports.NAME_FOR_NH_DOWNLOAD_DEFAULT = exports.LABEL_COLOR_DEFAULT = exports.INTERNAL_NODE_FONT_SIZE_DEFAULT = exports.FOUND1_COLOR_DEFAULT = exports.FOUND0AND1_COLOR_DEFAULT = exports.FOUND0_COLOR_DEFAULT = exports.FONT_DEFAULTS = exports.EXTERNAL_NODE_FONT_SIZE_DEFAULT = exports.DECIMALS_FOR_LINEAR_RANGE_MEAN_VALUE_DEFAULT = exports.COLLAPSED_LABEL_LENGTH_DEFAULT = exports.BRANCH_WIDTH_DEFAULT = exports.BRANCH_DATA_FONT_SIZE_DEFAULT = exports.BRANCH_COLOR_DEFAULT = exports.BACKGROUND_COLOR_FOR_PRINT_EXPORT_DEFAULT = exports.BACKGROUND_COLOR_DEFAULT = exports.XML_SUFFIX = exports.SVG_SUFFIX = exports.PNG_SUFFIX = exports.NH_SUFFIX = exports.VERTICAL = exports.HORIZONTAL = exports.WHITE = exports.LIGHT_BLUE = exports.NAME = exports.WEBSITE = exports.VERSION = void 0;
const d3_1 = __importDefault(require("d3"));
exports.VERSION = '1.0.0';
exports.WEBSITE = 'https://sites.google.com/site/cmzmasek/home/software/archaeopteryx-js';
exports.NAME = 'Alcmonavis-Poeschli.js';
// -----------------------------
// Named colors and orientations
// -----------------------------
exports.LIGHT_BLUE = '#2590FD';
exports.WHITE = '#ffffff';
exports.HORIZONTAL = 'horizontal';
exports.VERTICAL = 'vertical';
// ------------------------------
// File suffixes
// ------------------------------
exports.NH_SUFFIX = '.tre';
exports.PNG_SUFFIX = '.png';
exports.SVG_SUFFIX = '.svg';
exports.XML_SUFFIX = '.xml';
// ---------------------------
// Default values for options
// ---------------------------
exports.BACKGROUND_COLOR_DEFAULT = '#f0f0f0';
exports.BACKGROUND_COLOR_FOR_PRINT_EXPORT_DEFAULT = '#ffffff';
exports.BRANCH_COLOR_DEFAULT = '#909090';
exports.BRANCH_DATA_FONT_SIZE_DEFAULT = 6;
exports.BRANCH_WIDTH_DEFAULT = 1;
exports.COLLAPSED_LABEL_LENGTH_DEFAULT = 7;
exports.DECIMALS_FOR_LINEAR_RANGE_MEAN_VALUE_DEFAULT = 0;
exports.EXTERNAL_NODE_FONT_SIZE_DEFAULT = 9;
exports.FONT_DEFAULTS = ['Arial', 'Helvetica', 'Times'];
exports.FOUND0_COLOR_DEFAULT = '#66cc00';
exports.FOUND0AND1_COLOR_DEFAULT = '#0000ee';
exports.FOUND1_COLOR_DEFAULT = '#ff00ff';
exports.INTERNAL_NODE_FONT_SIZE_DEFAULT = 6;
exports.LABEL_COLOR_DEFAULT = '#202020';
exports.NAME_FOR_NH_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + exports.NH_SUFFIX;
exports.NAME_FOR_PHYLOXML_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + exports.XML_SUFFIX;
exports.NAME_FOR_PNG_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + exports.PNG_SUFFIX;
exports.NAME_FOR_SVG_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + exports.SVG_SUFFIX;
exports.NODE_LABEL_GAP_DEFAULT = 10;
exports.NODE_SIZE_DEFAULT_DEFAULT = 3;
exports.NODE_VISUALIZATIONS_OPACITY_DEFAULT = 1;
exports.VISUALIZATIONS_LEGEND_ORIENTATION_DEFAULT = exports.VERTICAL;
exports.VISUALIZATIONS_LEGEND_XPOS_DEFAULT = 160;
exports.VISUALIZATIONS_LEGEND_YPOS_DEFAULT = 30;
// ---------------------------
// Default values for settings
// ---------------------------
exports.COLLAPSE_LABEL_WIDTH_DEFAULT = '20px';
exports.CONTROLS_0_LEFT_DEFAULT = 20;
exports.CONTROLS_0_TOP_DEFAULT = 20;
exports.CONTROLS_1_TOP_DEFAULT = 20;
exports.CONTROLS_1_WIDTH_DEFAULT = 160;
exports.CONTROLS_BACKGROUND_COLOR_DEFAULT = '#c0c0c0';
exports.CONTROLS_FONT_COLOR_DEFAULT = '#505050';
exports.CONTROLS_FONT_DEFAULTS = ['Arial', 'Helvetica', 'Times'];
exports.CONTROLS_FONT_SIZE_DEFAULT = 8;
exports.DISPLY_HEIGHT_DEFAULT = 600;
exports.DISPLAY_WIDTH_DEFAULT = 800;
// export const MOLSEQ_FONT_DEFAULTS = ['Courier', 'Courier New', 'Lucida Console', 'Monaco', 'Arial', 'Helvetica', 'Times'];
exports.MOLSEQ_FONT_DEFAULTS = ['Courier', 'Courier New', 'Arial', 'Helvetica', 'Times'];
exports.ROOTOFFSET_DEFAULT = 180;
exports.SEARCH_FIELD_WIDTH_DEFAULT = '38px';
exports.TEXT_INPUT_FIELD_DEFAULT_HEIGHT = '10px';
// ------------------------------
// Various export constants and settings
// ------------------------------
exports.ACC_GENBANK = "GENBANK";
exports.ACC_REFSEQ = "REFSEQ";
exports.ACC_UNIPROT = "UNIPROT";
exports.ACC_UNIPROTKB = "UNIPROTKB";
exports.ACC_SWISSPROT = "SWISSPROT";
exports.ACC_TREMBL = "TREMBL";
exports.BRANCH_EVENT_APPLIES_TO = 'parent_branch';
exports.BRANCH_EVENT_DATATYPE = 'xsd:string';
exports.BRANCH_EVENT_REF = 'aptx:branch_event';
exports.BRANCH_LENGTH_DIGITS_DEFAULT = 4;
exports.BRANCH_WIDTH_MAX = 9;
exports.BRANCH_WIDTH_MIN = 0.5;
exports.BUTTON_ZOOM_IN_FACTOR = 1.1;
exports.BUTTON_ZOOM_IN_FACTOR_SLOW = 1.05;
exports.BUTTON_ZOOM_OUT_FACTOR = 1 / exports.BUTTON_ZOOM_IN_FACTOR;
exports.BUTTON_ZOOM_OUT_FACTOR_SLOW = 1 / exports.BUTTON_ZOOM_IN_FACTOR_SLOW;
exports.COLOR_FOR_ACTIVE_ELEMENTS = exports.LIGHT_BLUE;
exports.COLOR_PICKER_BACKGROUND_BORDER_COLOR = '#808080';
exports.COLOR_PICKER_CLICKED_ORIG_COLOR_BORDER_COLOR = '#000000';
exports.CONFIDENCE_VALUE_DIGITS_DEFAULT = 2;
exports.DEFAULT = 'default';
exports.DUPLICATION_AND_SPECIATION_COLOR_COLOR = '#ffff00';
exports.DUPLICATION_COLOR = '#ff0000';
exports.FONT_SIZE_MAX = 26;
exports.FONT_SIZE_MIN = 2;
exports.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL = 'collapsed_spec_label';
exports.LABEL_SIZE_CALC_ADDITION = 40;
exports.LABEL_SIZE_CALC_FACTOR = 0.5;
exports.LEGEND_LABEL_COLOR = 'legendLabelColor';
exports.LEGEND_NODE_BORDER_COLOR = 'legendNodeBorderColor';
exports.LEGEND_NODE_FILL_COLOR = 'legendNodeFillColor';
exports.LEGEND_NODE_SHAPE = 'legendNodeShape';
exports.LEGEND_NODE_SIZE = 'legendNodeSize';
exports.LINEAR_SCALE = 'linear';
exports.MAX_LENGTH_FOR_COLLAPSE_BY_FEATURE_LABEL = 10;
exports.MOVE_INTERVAL = 150;
exports.NH_EXPORT_FORMAT = 'Newick'; // OPTION value
exports.HEIGHT_OFFSET = 40;
exports.NODE_SIZE_MAX = 9;
exports.NODE_SIZE_MIN = 1;
exports.NODE_TOOLTIP_BACKGROUND_COLOR = '#606060';
exports.NODE_TOOLTIP_TEXT_ACTIVE_COLOR = exports.COLOR_FOR_ACTIVE_ELEMENTS;
exports.NODE_TOOLTIP_TEXT_COLOR = exports.WHITE;
exports.NONE = 'none';
exports.OFF_FEATURE = 'off'; // OPTIONS value
exports.ORDINAL_SCALE = 'ordinal';
exports.PDF_EXPORT_FORMAT = 'PDF'; // OPTION value
exports.PHYLOXML_EXPORT_FORMAT = 'phyloXML'; // OPTION value
exports.PNG_EXPORT_FORMAT = 'PNG'; // OPTION value
exports.MSA_RESIDUE = 'MSA Residue';
exports.RESET_SEARCH_A_BTN_TOOLTIP = 'reset (remove) search result A'; // BUTTON tooltip (title)
exports.RESET_SEARCH_B_BTN_TOOLTIP = 'reset (remove) search result B'; // BUTTON tooltip (title)
exports.SAME_AS_FILL = 'sameasfill';
exports.SHORTEN_NAME_MAX_LENGTH = 18;
exports.SLIDER_STEP = 0.5;
exports.SPECIATION_COLOR = '#00ff00';
exports.SPECIES_FEATURE = 'Species'; // OPTIONS value
exports.SVG_EXPORT_FORMAT = 'SVG'; // OPTION value
exports.TOP_AND_BOTTOM_BORDER_HEIGHT = 10;
exports.TRANSITION_DURATION_DEFAULT = 750;
exports.WARNING = 'ArchaeopteryxJS: WARNING';
exports.MESSAGE = 'ArchaeopteryxJS: ';
exports.ERROR = 'ArchaeopteryxJS: ERROR: ';
exports.WIDTH_OFFSET = 14; // Needed in Firefox Quantum (2018-02-22)
exports.ZOOM_INTERVAL = 200;
// ---------------------------
// Names for GUI elements
// ---------------------------
exports.BASE_BACKGROUND = 'basebackground';
exports.BL_COLLAPSE_LABEL = 'bl_col_label'; // INPUT text id
exports.BRANCH_COLORS_CB = 'brnch_col_cb'; // INPUT checkbox id
exports.BRANCH_DATA_FONT_SIZE_SLIDER = 'bdfs_sl'; // DIV id
exports.BRANCH_EVENTS_CB = 'brevts_cb'; // INPUT checkbox id
exports.BRANCH_LENGTH_VALUES_CB = 'bl_cb'; // INPUT checkbox id
exports.BRANCH_VIS_CB = 'branchvis_cb'; // INPUT checkbox id
exports.BRANCH_WIDTH_SLIDER = 'bw_sl'; // DIV id
exports.CLADOGRAM_BUTTON = 'cla_b'; // INPUT radio id
exports.COLLAPSE_BY_FEATURE_SELECT = 'coll_by_feat_sel'; // SELECT id
exports.COLOR_PICKER = 'col_pick';
exports.COLOR_PICKER_LABEL = 'colorPickerLabel';
exports.CONFIDENCE_VALUES_CB = 'conf_cb'; // INPUT checkbox id
exports.CONTROLS_0 = 'controls0';
exports.CONTROLS_1 = 'controls1';
exports.DECR_BL_COLLAPSE_LEVEL = 'decr_blcl'; // BUTTON id
exports.DECR_DEPTH_COLLAPSE_LEVEL = 'decr_dcl'; // BUTTON id
exports.DEPTH_COLLAPSE_LABEL = 'depth_col_label'; // INPUT text id
exports.DISPLAY_DATA_CONTROLGROUP = 'display_data_g'; // DIV class
exports.DOWNLOAD_BUTTON = 'dl_b'; // BUTTON id
exports.DYNAHIDE_CB = 'dynahide_cb'; // INPUT checkbox id
exports.EXPORT_FORMAT_SELECT = 'exp_f_sel'; // SELECT id
exports.EXTERNAL_FONT_SIZE_SLIDER = 'entfs_sl'; // DIV id
exports.EXTERNAL_LABEL_CB = 'extl_cb'; // INPUT checkbox id
exports.EXTERNAL_NODES_CB = 'extn_cb'; // INPUT checkbox id
exports.INCR_BL_COLLAPSE_LEVEL = 'incr_blcl'; // BUTTON id
exports.INCR_DEPTH_COLLAPSE_LEVEL = 'incr_dcl'; // BUTTON id
exports.INTERNAL_FONT_SIZE_SLIDER = 'intfs_sl';
exports.INTERNAL_LABEL_CB = 'intl_cb'; // INPUT checkbox id
exports.INTERNAL_NODES_CB = 'intn_cb'; // INPUT checkbox id
exports.LABEL_COLOR_SELECT_MENU = 'lcs_menu'; // SELECT id
exports.LEGEND = 'legend';
exports.LEGEND_DESCRIPTION = 'legendDescription';
exports.LEGEND_LABEL = 'legendLabel';
exports.LEGENDS_HORIZ_VERT_BTN = 'legends_horizvert'; // BUTTON id
exports.LEGENDS_MOVE_DOWN_BTN = 'legends_mdown'; // BUTTON id
exports.LEGENDS_MOVE_LEFT_BTN = 'legends_mleft'; // BUTTON id
exports.LEGENDS_MOVE_RIGHT_BTN = 'legends_mright'; // BUTTON id
exports.LEGENDS_MOVE_UP_BTN = 'legends_mup'; // BUTTON id
exports.LEGENDS_RESET_BTN = 'legends_rest'; // BUTTON id
exports.LEGENDS_SHOW_BTN = 'legends_show'; // BUTTON id
exports.MIDPOINT_ROOT_BUTTON = 'midpointr_b'; // BUTTON id
exports.MSA_RESIDUE_VIS_CURR_RES_POS_LABEL = 'seq_pos_label_curr_pos'; // INPUT text id
exports.MSA_RESIDUE_VIS_CURR_RES_POS_SLIDER_1 = 'seq_pos_slider_1'; // DIV id
exports.MSA_RESIDUE_VIS_DECR_CURR_RES_POS_BTN = 'seq_pos_decr_pos'; // BUTTON id
exports.MSA_RESIDUE_VIS_INCR_CURR_RES_POS_BTN = 'seq_pos_incr_pos'; // BUTTON id
exports.NODE_BORDER_COLOR_SELECT_MENU = 'nbcolors_menu';
exports.NODE_DATA = 'node_data_dialog';
exports.NODE_EVENTS_CB = 'nevts_cb'; // INPUT checkbox id
exports.NODE_FILL_COLOR_SELECT_MENU = 'nfcolors_menu'; // SELECT id
exports.NODE_NAME_CB = 'nn_cb'; // INPUT checkbox id
exports.NODE_SHAPE_SELECT_MENU = 'nshapes_menu'; // SELECT id
exports.NODE_SIZE_SELECT_MENU = 'nsizes_menu'; // SELECT id
exports.NODE_SIZE_SLIDER = 'ns_sl'; // DIV id
exports.NODE_VIS_CB = 'nodevis_cb'; // INPUT checkbox id
exports.ORDER_BUTTON = 'ord_b'; // BUTTON id
exports.PHYLOGRAM_ALIGNED_BUTTON = 'phya_b'; // INPUT radio id
exports.PHYLOGRAM_BUTTON = 'phy_b'; // INPUT radio id
exports.PHYLOGRAM_CLADOGRAM_CONTROLGROUP = 'phy_cla_g'; // DIV class
exports.PROG_NAME = 'progname'; // DIV class
exports.PROGNAMELINK = 'prognamelink'; // A class
exports.RESET_SEARCH_A_BTN = 'reset_s_a'; // BUTTON id
exports.RESET_SEARCH_B_BTN = 'reset_s_b'; // BUTTON id
exports.RETURN_TO_SUPERTREE_BUTTON = 'ret_b'; // BUTTON id
exports.SEARCH_FIELD_0 = 'sf0'; // INPUT text id
exports.SEARCH_FIELD_1 = 'sf1'; // INPUT text id
exports.SEARCH_OPTIONS_CASE_SENSITIVE_CB = 'so_cs_cb'; // INPUT checkbox id
exports.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB = 'so_cto_cb'; // INPUT checkbox id
exports.SEARCH_OPTIONS_GROUP = 'search_opts_g'; // DIV class
exports.SEARCH_OPTIONS_NEGATE_RES_CB = 'so_neg_cb'; // INPUT checkbox id
exports.SEARCH_OPTIONS_REGEX_CB = 'so_regex_cb'; // INPUT checkbox id
exports.SEQUENCE_CB = 'seq_cb'; // INPUT checkbox id
exports.SHORTEN_NODE_NAME_CB = 'shortennodename_cb'; // INPUT checkbox id
exports.TAXONOMY_CB = 'tax_cb'; // INPUT checkbox id
exports.UNCOLLAPSE_ALL_BUTTON = 'unc_b'; // BUTTON id
exports.ZOOM_IN_X = 'zoomin_x'; // BUTTON id
exports.ZOOM_IN_Y = 'zoomout_y'; // BUTTON id // BM ?
exports.ZOOM_OUT_X = 'zoomout_x'; // BUTTON id
exports.ZOOM_OUT_Y = 'zoomin_y'; // BUTTON id // BM ??
exports.ZOOM_TO_FIT = 'zoomtofit'; // BUTTON id
exports.LABEL_COLOR_SELECT_MENU_2 = 'lcs_2_menu'; // SELECT id //~~
exports.NODE_FILL_COLOR_SELECT_MENU_2 = 'nfcolors_2_menu'; // SELECT id
exports.NODE_BORDER_COLOR_SELECT_MENU_2 = 'nbcolors_2_menu'; // SELECT id
exports.LABEL_COLOR_SELECT_MENU_3 = 'lcs_3_menu'; // SELECT id //~~~
exports.NODE_FILL_COLOR_SELECT_MENU_3 = 'nfcolors_3_menu'; // SELECT id
exports.NODE_BORDER_COLOR_SELECT_MENU_3 = 'nbcolors_3_menu'; // SELECT id
// ---------------------------
// Key codes
// ---------------------------
exports.VK_ESC = 27;
exports.VK_A = 65;
exports.VK_C = 67;
exports.VK_L = 76;
exports.VK_M = 77;
exports.VK_O = 79;
exports.VK_P = 80;
exports.VK_R = 82;
exports.VK_S = 83;
exports.VK_U = 85;
exports.VK_0 = 48;
exports.VK_9 = 57;
exports.VK_0_NUMPAD = 96;
exports.VK_9_NUMPAD = 105;
exports.VK_DELETE = 46;
exports.VK_BACKSPACE = 8;
exports.VK_HOME = 36;
exports.VK_UP = 38;
exports.VK_DOWN = 40;
exports.VK_LEFT = 37;
exports.VK_RIGHT = 39;
exports.VK_PLUS = 187;
exports.VK_MINUS = 189;
exports.VK_PLUS_N = 107;
exports.VK_MINUS_N = 109;
exports.VK_PAGE_UP = 33;
exports.VK_PAGE_DOWN = 34;
exports.VK_OPEN_BRACKET = 219;
exports.VK_CLOSE_BRACKET = 221;
// ---------------------------
// Regular Expressions
// ---------------------------
exports.RE_SWISSPROT_TREMBL = new RegExp('^(?=.*[A-Z].*_.*[A-Z].*)[A-Z0-9]{2,10}_[A-Z0-9]{3,5}$');
exports.RE_SWISSPROT_TREMBL_PFAM = new RegExp('^((?=.*[A-Z].*_.*[A-Z].*)[A-Z0-9]{2,10}_[A-Z0-9]{3,5})/[0-9]+-[0-9]+$');
exports.RE_GENBANK_PROT = new RegExp('^[A-Z]{3}[0-9\\\\.]+$');
exports.RE_GENBANK_NUC = new RegExp('^[A-Z]{1,2}[0-9\\\\.]+$');
exports.RE_REFSEQ = new RegExp('^[A-Z]{2}_[0-9\\\\.]+$');
exports.RE_UNIPROTKB = new RegExp('^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$');
// ---------------------------
// Colors
// ---------------------------
exports.col_category50 = [
    // 1 Red
    '#FF1744',
    // 2 Pink
    '#F50057',
    // 3 Purple
    '#D500F9',
    // 4 Deep Purple
    '#651FFF',
    // 5 Indigo
    '#3D5AFE',
    // 6 Blue
    '#2979FF',
    // 7 Cyan
    '#00E5FF',
    // 8 Teal
    '#1DE9B6',
    // 9 Green
    '#00E676',
    // 10 Light Green
    '#76FF03',
    // 11 Lime
    '#C6FF00',
    // 12 Yellow
    '#FFEA00',
    // 13 Amber
    '#FFC400',
    // 14 Orange
    '#FF9100',
    // 15 Deep Orange
    '#FF3D00',
    // 16 Brown
    '#6D4C41',
    // 17 Grey
    '#757575',
    //
    // 18 Red
    '#B71C1C',
    // 19 Pink
    '#880E4F',
    // 20 Purple
    '#4A148C',
    // 21 Deep Purple
    '#311B92',
    // 22 Indigo
    '#1A237E',
    // 23 Blue
    '#0D47A1',
    // 24 Cyan
    '#006064',
    // 25 Teal
    '#004D40',
    // 26 Green
    '#1B5E20',
    // 27 Light Green
    '#33691E',
    // 28 Lime
    '#827717',
    // 29 Yellow
    '#F57F17',
    // 30 Amber
    '#FF6F00',
    // 31 Orange
    '#E65100',
    // 32 Deep Orange
    '#BF360C',
    // 33 Brown
    '#4E342E',
    // 34 Grey
    '#424242',
    //
    // 35 Red
    '#EF9A9A',
    // 36 Pink
    '#F48FB1',
    // 37 Purple
    '#CE93D8',
    // 38 Deep Purple
    '#B39DDB',
    // 39 Indigo
    '#9FA8DA',
    // 40 Blue
    '#90CAF9',
    // 41 Cyan
    '#80DEEA',
    // 42 Teal
    '#80CBC4',
    // 43 Green
    '#A5D6A7',
    // 44 Light Green
    '#C5E1A5',
    // 45 Lime
    '#E6EE9C',
    // 46 Amber
    '#FFE082',
    // 47 Orange
    '#FFCC80',
    // 48 Deep Orange
    '#FFAB91',
    // 49 Brown
    '#BCAAA4',
    // 50 Grey
    '#E0E0E0'
];
exports.col_category50b = [
    "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059", "#7A4900", "#0000A6", "#63FFAC", "#B79762",
    "#004D43", "#8FB0FF", "#997D87", "#5A0007", "#809693", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
    "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#D16100", "#000035", "#7B4F4B", "#A1C299",
    "#300018", "#0AA6D8", "#013349", "#00846F", "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2",
    "#C2FF99", "#001E09", "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66"
];
exports.col_category50c = [
    // Red
    '#FF5252', '#FF1744', '#D50000',
    // Pink
    '#FF4081', '#F50057', '#C51162',
    // Purple
    '#E040FB', '#D500F9', '#AA00FF',
    // Deep Purple
    '#7C4DFF', '#651FFF', '#6200EA',
    // Indigo
    '#536DFE', '#3D5AFE', '#304FFE',
    // Blue
    '#448AFF', '#2979FF', '#2962FF',
    // Cyan
    '#18FFFF', '#00E5FF', '#00B8D4',
    // Teal
    '#64FFDA', '#1DE9B6', '#00BFA5',
    // Green
    '#69F0AE', '#00E676', '#00C853',
    // Light Green
    '#B2FF59', '#76FF03', '#64DD17',
    // Lime
    '#EEFF41', '#C6FF00', '#AEEA00',
    // Yellow
    '#FFFF00', '#FFEA00', '#FFD600',
    // Amber
    '#FFD740', '#FFC400', '#FFAB00',
    // Orange
    '#FFAB40', '#FF9100', '#FF6D00',
    // Deep Orange
    '#FF6E40', '#FF3D00', '#DD2C00',
    // Brown
    '#5D4037', '#4E342E', '#3E2723',
    // Grey
    '#9E9E9E', '#616161'
];
exports.category50 = () => d3_1.default.scale.ordinal().domain([]).range(exports.col_category50);
exports.category50b = () => d3_1.default.scale.ordinal().domain([]).range(exports.col_category50b);
exports.category50c = () => d3_1.default.scale.ordinal().domain([]).range(exports.col_category50c);
//# sourceMappingURL=constants.js.map