import d3 from 'd3';

export const VERSION = '1.0.0';
export const WEBSITE = 'https://sites.google.com/site/cmzmasek/home/software/archaeopteryx-js';
export const NAME = 'Alcmonavis-Poeschli.js';

// -----------------------------
// Named colors and orientations
// -----------------------------
export const LIGHT_BLUE = '#2590FD';
export const WHITE = '#ffffff';
export const HORIZONTAL = 'horizontal';
export const VERTICAL = 'vertical';

// ------------------------------
// File suffixes
// ------------------------------
export const NH_SUFFIX = '.tre';
export const PNG_SUFFIX = '.png';
export const SVG_SUFFIX = '.svg';
export const XML_SUFFIX = '.xml';

// ---------------------------
// Default values for options
// ---------------------------
export const BACKGROUND_COLOR_DEFAULT = '#f0f0f0';
export const BACKGROUND_COLOR_FOR_PRINT_EXPORT_DEFAULT = '#ffffff';
export const BRANCH_COLOR_DEFAULT = '#909090';
export const BRANCH_DATA_FONT_SIZE_DEFAULT = 6;
export const BRANCH_WIDTH_DEFAULT = 1;
export const COLLAPSED_LABEL_LENGTH_DEFAULT = 7;
export const DECIMALS_FOR_LINEAR_RANGE_MEAN_VALUE_DEFAULT = 0;
export const EXTERNAL_NODE_FONT_SIZE_DEFAULT = 9;
export const FONT_DEFAULTS = ['Arial', 'Helvetica', 'Times'];
export const FOUND0_COLOR_DEFAULT = '#66cc00';
export const FOUND0AND1_COLOR_DEFAULT = '#0000ee';
export const FOUND1_COLOR_DEFAULT = '#ff00ff';
export const INTERNAL_NODE_FONT_SIZE_DEFAULT = 6;
export const LABEL_COLOR_DEFAULT = '#202020';
export const NAME_FOR_NH_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + NH_SUFFIX;
export const NAME_FOR_PHYLOXML_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + XML_SUFFIX;
export const NAME_FOR_PNG_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + PNG_SUFFIX;
export const NAME_FOR_SVG_DOWNLOAD_DEFAULT = 'archaeopteryx_js' + SVG_SUFFIX;
export const NODE_LABEL_GAP_DEFAULT = 10;
export const NODE_SIZE_DEFAULT_DEFAULT = 3;
export const NODE_VISUALIZATIONS_OPACITY_DEFAULT = 1;
export const VISUALIZATIONS_LEGEND_ORIENTATION_DEFAULT = VERTICAL;
export const VISUALIZATIONS_LEGEND_XPOS_DEFAULT = 160;
export const VISUALIZATIONS_LEGEND_YPOS_DEFAULT = 30;

// ---------------------------
// Default values for settings
// ---------------------------
export const COLLAPSE_LABEL_WIDTH_DEFAULT = '20px';
export const CONTROLS_0_LEFT_DEFAULT = 20;
export const CONTROLS_0_TOP_DEFAULT = 20;
export const CONTROLS_1_TOP_DEFAULT = 20;
export const CONTROLS_1_WIDTH_DEFAULT = 160;
export const CONTROLS_BACKGROUND_COLOR_DEFAULT = '#c0c0c0';
export const CONTROLS_FONT_COLOR_DEFAULT = '#505050';
export const CONTROLS_FONT_DEFAULTS = ['Arial', 'Helvetica', 'Times'];
export const CONTROLS_FONT_SIZE_DEFAULT = 8;
export const DISPLY_HEIGHT_DEFAULT = 600;
export const DISPLAY_WIDTH_DEFAULT = 800;
// export const MOLSEQ_FONT_DEFAULTS = ['Courier', 'Courier New', 'Lucida Console', 'Monaco', 'Arial', 'Helvetica', 'Times'];
export const MOLSEQ_FONT_DEFAULTS = ['Courier', 'Courier New', 'Arial', 'Helvetica', 'Times'];

export const ROOTOFFSET_DEFAULT = 180;
export const SEARCH_FIELD_WIDTH_DEFAULT = '38px';
export const TEXT_INPUT_FIELD_DEFAULT_HEIGHT = '10px';

// ------------------------------
// Various export constants and settings
// ------------------------------
export const ACC_GENBANK = 'GENBANK';
export const ACC_REFSEQ = 'REFSEQ';
export const ACC_UNIPROT = 'UNIPROT';
export const ACC_UNIPROTKB = 'UNIPROTKB';
export const ACC_SWISSPROT = 'SWISSPROT';
export const ACC_TREMBL = 'TREMBL';
export const BRANCH_EVENT_APPLIES_TO = 'parent_branch';
export const BRANCH_EVENT_DATATYPE = 'xsd:string';
export const BRANCH_EVENT_REF = 'aptx:branch_event';
export const BRANCH_LENGTH_DIGITS_DEFAULT = 4;
export const BRANCH_WIDTH_MAX = 9;
export const BRANCH_WIDTH_MIN = 0.5;
export const BUTTON_ZOOM_IN_FACTOR = 1.1;
export const BUTTON_ZOOM_IN_FACTOR_SLOW = 1.05;
export const BUTTON_ZOOM_OUT_FACTOR = 1 / BUTTON_ZOOM_IN_FACTOR;
export const BUTTON_ZOOM_OUT_FACTOR_SLOW = 1 / BUTTON_ZOOM_IN_FACTOR_SLOW;
export const COLOR_FOR_ACTIVE_ELEMENTS = LIGHT_BLUE;
export const COLOR_PICKER_BACKGROUND_BORDER_COLOR = '#808080';
export const COLOR_PICKER_CLICKED_ORIG_COLOR_BORDER_COLOR = '#000000';
export const CONFIDENCE_VALUE_DIGITS_DEFAULT = 2;
export const DEFAULT = 'default';
export const DUPLICATION_AND_SPECIATION_COLOR_COLOR = '#ffff00';
export const DUPLICATION_COLOR = '#ff0000';
export const FONT_SIZE_MAX = 26;
export const FONT_SIZE_MIN = 2;
export const KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL = 'collapsed_spec_label';
export const LABEL_SIZE_CALC_ADDITION = 40;
export const LABEL_SIZE_CALC_FACTOR = 0.5;
export const LEGEND_LABEL_COLOR = 'legendLabelColor';
export const LEGEND_NODE_BORDER_COLOR = 'legendNodeBorderColor';
export const LEGEND_NODE_FILL_COLOR = 'legendNodeFillColor';
export const LEGEND_NODE_SHAPE = 'legendNodeShape';
export const LEGEND_NODE_SIZE = 'legendNodeSize';
export const LINEAR_SCALE = 'linear';
export const MAX_LENGTH_FOR_COLLAPSE_BY_FEATURE_LABEL = 10;
export const MOVE_INTERVAL = 150;
export const NH_EXPORT_FORMAT = 'Newick'; // OPTION value
export const HEIGHT_OFFSET = 40;
export const NODE_SIZE_MAX = 9;
export const NODE_SIZE_MIN = 1;
export const NODE_TOOLTIP_BACKGROUND_COLOR = '#606060';
export const NODE_TOOLTIP_TEXT_ACTIVE_COLOR = COLOR_FOR_ACTIVE_ELEMENTS;
export const NODE_TOOLTIP_TEXT_COLOR = WHITE;
export const NONE = 'none';
export const OFF_FEATURE = 'off'; // OPTIONS value
export const ORDINAL_SCALE = 'ordinal';
export const PDF_EXPORT_FORMAT = 'PDF'; // OPTION value
export const PHYLOXML_EXPORT_FORMAT = 'phyloXML'; // OPTION value
export const PNG_EXPORT_FORMAT = 'PNG'; // OPTION value
export const MSA_RESIDUE = 'MSA Residue';
export const RESET_SEARCH_A_BTN_TOOLTIP = 'reset (remove) search result A'; // BUTTON tooltip (title)
export const RESET_SEARCH_B_BTN_TOOLTIP = 'reset (remove) search result B'; // BUTTON tooltip (title)
export const SAME_AS_FILL = 'sameasfill';
export const SHORTEN_NAME_MAX_LENGTH = 18;
export const SLIDER_STEP = 0.5;
export const SPECIATION_COLOR = '#00ff00';
export const SPECIES_FEATURE = 'Species'; // OPTIONS value
export const SVG_EXPORT_FORMAT = 'SVG'; // OPTION value
export const TOP_AND_BOTTOM_BORDER_HEIGHT = 10;
export const TRANSITION_DURATION_DEFAULT = 750;
export const WARNING = 'ArchaeopteryxJS: WARNING';
export const MESSAGE = 'ArchaeopteryxJS: ';
export const ERROR = 'ArchaeopteryxJS: ERROR: ';
export const WIDTH_OFFSET = 14; // Needed in Firefox Quantum (2018-02-22)
export const ZOOM_INTERVAL = 200;

// ---------------------------
// Database Search constants
// ---------------------------
export const IDFIELD = 'ID';
export const CALLSIZE = 1000;

// ---------------------------
// Names for GUI elements
// ---------------------------
export const BASE_BACKGROUND = 'basebackground';
export const BL_COLLAPSE_LABEL = 'bl_col_label'; // INPUT text id
export const BRANCH_COLORS_CB = 'brnch_col_cb'; // INPUT checkbox id
export const BRANCH_DATA_FONT_SIZE_SLIDER = 'bdfs_sl'; // DIV id
export const BRANCH_EVENTS_CB = 'brevts_cb'; // INPUT checkbox id
export const BRANCH_LENGTH_VALUES_CB = 'bl_cb'; // INPUT checkbox id
export const BRANCH_VIS_CB = 'branchvis_cb'; // INPUT checkbox id
export const BRANCH_WIDTH_SLIDER = 'bw_sl'; // DIV id
export const CLADOGRAM_BUTTON = 'cla_b'; // INPUT radio id
export const COLLAPSE_BY_FEATURE_SELECT = 'coll_by_feat_sel'; // SELECT id
export const COLOR_PICKER = 'col_pick';
export const COLOR_PICKER_LABEL = 'colorPickerLabel';
export const CONFIDENCE_VALUES_CB = 'conf_cb'; // INPUT checkbox id
export const CONTROLS_0 = 'controls0';
export const CONTROLS_1 = 'controls1';
export const DECR_BL_COLLAPSE_LEVEL = 'decr_blcl'; // BUTTON id
export const DECR_DEPTH_COLLAPSE_LEVEL = 'decr_dcl'; // BUTTON id
export const DEPTH_COLLAPSE_LABEL = 'depth_col_label'; // INPUT text id
export const DISPLAY_DATA_CONTROLGROUP = 'display_data_g'; // DIV class
export const DOWNLOAD_BUTTON = 'dl_b'; // BUTTON id
export const DYNAHIDE_CB = 'dynahide_cb'; // INPUT checkbox id
export const EXPORT_FORMAT_SELECT = 'exp_f_sel'; // SELECT id
export const EXTERNAL_FONT_SIZE_SLIDER = 'entfs_sl'; // DIV id
export const EXTERNAL_LABEL_CB = 'extl_cb'; // INPUT checkbox id
export const EXTERNAL_NODES_CB = 'extn_cb'; // INPUT checkbox id
export const INCR_BL_COLLAPSE_LEVEL = 'incr_blcl'; // BUTTON id
export const INCR_DEPTH_COLLAPSE_LEVEL = 'incr_dcl'; // BUTTON id
export const INTERNAL_FONT_SIZE_SLIDER = 'intfs_sl';
export const INTERNAL_LABEL_CB = 'intl_cb'; // INPUT checkbox id
export const INTERNAL_NODES_CB = 'intn_cb'; // INPUT checkbox id
export const LABEL_COLOR_SELECT_MENU = 'lcs_menu'; // SELECT id
export const LEGEND = 'legend';
export const LEGEND_DESCRIPTION = 'legendDescription';
export const LEGEND_LABEL = 'legendLabel';
export const LEGENDS_HORIZ_VERT_BTN = 'legends_horizvert'; // BUTTON id
export const LEGENDS_MOVE_DOWN_BTN = 'legends_mdown'; // BUTTON id
export const LEGENDS_MOVE_LEFT_BTN = 'legends_mleft'; // BUTTON id
export const LEGENDS_MOVE_RIGHT_BTN = 'legends_mright'; // BUTTON id
export const LEGENDS_MOVE_UP_BTN = 'legends_mup'; // BUTTON id
export const LEGENDS_RESET_BTN = 'legends_rest'; // BUTTON id
export const LEGENDS_SHOW_BTN = 'legends_show'; // BUTTON id
export const MIDPOINT_ROOT_BUTTON = 'midpointr_b'; // BUTTON id
export const MSA_RESIDUE_VIS_CURR_RES_POS_LABEL = 'seq_pos_label_curr_pos'; // INPUT text id
export const MSA_RESIDUE_VIS_CURR_RES_POS_SLIDER_1 = 'seq_pos_slider_1'; // DIV id
export const MSA_RESIDUE_VIS_DECR_CURR_RES_POS_BTN = 'seq_pos_decr_pos'; // BUTTON id
export const MSA_RESIDUE_VIS_INCR_CURR_RES_POS_BTN = 'seq_pos_incr_pos'; // BUTTON id
export const NODE_BORDER_COLOR_SELECT_MENU = 'nbcolors_menu';
export const NODE_DATA = 'node_data_dialog';
export const NODE_EVENTS_CB = 'nevts_cb'; // INPUT checkbox id
export const NODE_FILL_COLOR_SELECT_MENU = 'nfcolors_menu'; // SELECT id
export const NODE_NAME_CB = 'nn_cb'; // INPUT checkbox id
export const NODE_SHAPE_SELECT_MENU = 'nshapes_menu'; // SELECT id
export const NODE_SIZE_SELECT_MENU = 'nsizes_menu'; // SELECT id
export const NODE_SIZE_SLIDER = 'ns_sl'; // DIV id
export const NODE_VIS_CB = 'nodevis_cb'; // INPUT checkbox id
export const ORDER_BUTTON = 'ord_b'; // BUTTON id
export const PHYLOGRAM_ALIGNED_BUTTON = 'phya_b'; // INPUT radio id
export const PHYLOGRAM_BUTTON = 'phy_b'; // INPUT radio id
export const PHYLOGRAM_CLADOGRAM_CONTROLGROUP = 'phy_cla_g'; // DIV class
export const PROG_NAME = 'progname'; // DIV class
export const PROGNAMELINK = 'prognamelink'; // A class
export const RESET_SEARCH_A_BTN = 'reset_s_a'; // BUTTON id
export const RESET_SEARCH_B_BTN = 'reset_s_b'; // BUTTON id
export const RETURN_TO_SUPERTREE_BUTTON = 'ret_b'; // BUTTON id
export const SEARCH_FIELD_0 = 'sf0'; // INPUT text id
export const SEARCH_FIELD_1 = 'sf1'; // INPUT text id
export const SEARCH_OPTIONS_CASE_SENSITIVE_CB = 'so_cs_cb'; // INPUT checkbox id
export const SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB = 'so_cto_cb'; // INPUT checkbox id
export const SEARCH_OPTIONS_GROUP = 'search_opts_g'; // DIV class
export const SEARCH_OPTIONS_NEGATE_RES_CB = 'so_neg_cb'; // INPUT checkbox id
export const SEARCH_OPTIONS_REGEX_CB = 'so_regex_cb'; // INPUT checkbox id
export const SEQUENCE_CB = 'seq_cb'; // INPUT checkbox id
export const SHORTEN_NODE_NAME_CB = 'shortennodename_cb'; // INPUT checkbox id
export const TAXONOMY_CB = 'tax_cb'; // INPUT checkbox id
export const UNCOLLAPSE_ALL_BUTTON = 'unc_b'; // BUTTON id
export const ZOOM_IN_X = 'zoomin_x'; // BUTTON id
export const ZOOM_IN_Y = 'zoomout_y'; // BUTTON id // BM ?
export const ZOOM_OUT_X = 'zoomout_x'; // BUTTON id
export const ZOOM_OUT_Y = 'zoomin_y'; // BUTTON id // BM ??
export const ZOOM_TO_FIT = 'zoomtofit'; // BUTTON id

export const LABEL_COLOR_SELECT_MENU_2 = 'lcs_2_menu'; // SELECT id //~~
export const NODE_FILL_COLOR_SELECT_MENU_2 = 'nfcolors_2_menu'; // SELECT id
export const NODE_BORDER_COLOR_SELECT_MENU_2 = 'nbcolors_2_menu'; // SELECT id

export const LABEL_COLOR_SELECT_MENU_3 = 'lcs_3_menu'; // SELECT id //~~~
export const NODE_FILL_COLOR_SELECT_MENU_3 = 'nfcolors_3_menu'; // SELECT id
export const NODE_BORDER_COLOR_SELECT_MENU_3 = 'nbcolors_3_menu'; // SELECT id

// ---------------------------
// Key codes
// ---------------------------
export const VK_ESC = 27;
export const VK_A = 65;
export const VK_C = 67;
export const VK_L = 76;
export const VK_M = 77;
export const VK_O = 79;
export const VK_P = 80;
export const VK_R = 82;
export const VK_S = 83;
export const VK_U = 85;
export const VK_0 = 48;
export const VK_9 = 57;
export const VK_0_NUMPAD = 96;
export const VK_9_NUMPAD = 105;
export const VK_DELETE = 46;
export const VK_BACKSPACE = 8;
export const VK_HOME = 36;
export const VK_UP = 38;
export const VK_DOWN = 40;
export const VK_LEFT = 37;
export const VK_RIGHT = 39;
export const VK_PLUS = 187;
export const VK_MINUS = 189;
export const VK_PLUS_N = 107;
export const VK_MINUS_N = 109;
export const VK_PAGE_UP = 33;
export const VK_PAGE_DOWN = 34;
export const VK_OPEN_BRACKET = 219;
export const VK_CLOSE_BRACKET = 221;

// ---------------------------
// Regular Expressions
// ---------------------------

export const RE_SWISSPROT_TREMBL = new RegExp('^(?=.*[A-Z].*_.*[A-Z].*)[A-Z0-9]{2,10}_[A-Z0-9]{3,5}$');
export const RE_SWISSPROT_TREMBL_PFAM = new RegExp(
  '^((?=.*[A-Z].*_.*[A-Z].*)[A-Z0-9]{2,10}_[A-Z0-9]{3,5})/[0-9]+-[0-9]+$',
);
export const RE_GENBANK_PROT = new RegExp('^[A-Z]{3}[0-9\\\\.]+$');
export const RE_GENBANK_NUC = new RegExp('^[A-Z]{1,2}[0-9\\\\.]+$');
export const RE_REFSEQ = new RegExp('^[A-Z]{2}_[0-9\\\\.]+$');
export const RE_UNIPROTKB = new RegExp('^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$');

// ---------------------------
// Colors
// ---------------------------

export const col_category50 = [
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
  '#E0E0E0',
];

export const col_category50b = [
  '#1CE6FF',
  '#FF34FF',
  '#FF4A46',
  '#008941',
  '#006FA6',
  '#A30059',
  '#7A4900',
  '#0000A6',
  '#63FFAC',
  '#B79762',
  '#004D43',
  '#8FB0FF',
  '#997D87',
  '#5A0007',
  '#809693',
  '#1B4400',
  '#4FC601',
  '#3B5DFF',
  '#4A3B53',
  '#FF2F80',
  '#61615A',
  '#BA0900',
  '#6B7900',
  '#00C2A0',
  '#FFAA92',
  '#FF90C9',
  '#D16100',
  '#000035',
  '#7B4F4B',
  '#A1C299',
  '#300018',
  '#0AA6D8',
  '#013349',
  '#00846F',
  '#372101',
  '#FFB500',
  '#C2FFED',
  '#A079BF',
  '#CC0744',
  '#C0B9B2',
  '#C2FF99',
  '#001E09',
  '#00489C',
  '#6F0062',
  '#0CBD66',
  '#EEC3FF',
  '#456D75',
  '#B77B68',
  '#7A87A1',
  '#788D66',
];

export const col_category50c = [
  // Red
  '#FF5252',
  '#FF1744',
  '#D50000',
  // Pink
  '#FF4081',
  '#F50057',
  '#C51162',
  // Purple
  '#E040FB',
  '#D500F9',
  '#AA00FF',
  // Deep Purple
  '#7C4DFF',
  '#651FFF',
  '#6200EA',
  // Indigo
  '#536DFE',
  '#3D5AFE',
  '#304FFE',
  // Blue
  '#448AFF',
  '#2979FF',
  '#2962FF',
  // Cyan
  '#18FFFF',
  '#00E5FF',
  '#00B8D4',
  // Teal
  '#64FFDA',
  '#1DE9B6',
  '#00BFA5',
  // Green
  '#69F0AE',
  '#00E676',
  '#00C853',
  // Light Green
  '#B2FF59',
  '#76FF03',
  '#64DD17',
  // Lime
  '#EEFF41',
  '#C6FF00',
  '#AEEA00',
  // Yellow
  '#FFFF00',
  '#FFEA00',
  '#FFD600',
  // Amber
  '#FFD740',
  '#FFC400',
  '#FFAB00',
  // Orange
  '#FFAB40',
  '#FF9100',
  '#FF6D00',
  // Deep Orange
  '#FF6E40',
  '#FF3D00',
  '#DD2C00',
  // Brown
  '#5D4037',
  '#4E342E',
  '#3E2723',
  // Grey
  '#9E9E9E',
  '#616161',
];

export const category50 = <T extends { toString(): string }>() =>
  d3.scale.ordinal<T, string>().domain([]).range(col_category50);

export const category50b = <T extends { toString(): string }>() =>
  d3.scale.ordinal<T, string>().domain([]).range(col_category50b);

export const category50c = <T extends { toString(): string }>() =>
  d3.scale.ordinal<T, string>().domain([]).range(col_category50c);
