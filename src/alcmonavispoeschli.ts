require('./Blob.js');
require('./canvas-toBlob.js');
import $ from 'jquery';
import { phyloXml } from './phyloXml';
import { forester, isString } from './forester';
import d3 from 'd3';
import * as AP from './constants';
import { Alcmonavis, CustomD3Prototype, Dict, Forester, MappingFunction } from '../alcomanavispoeschli';

const scaleSwitch = (scale: d3.scale.Linear<number, number> | d3.scale.Ordinal<string, string>) => (
  d: number | string,
) =>
  typeof d === 'number'
    ? (scale as d3.scale.Linear<number, number>)(d)
    : (scale as d3.scale.Ordinal<string, string>)(d);
export default class alcmonavispoeschli {
  // ---------------------------
  // "Instance variables"
  // ---------------------------
  baseSvg!: d3.Selection<any>;
  basicTreeProperties: Forester.TreeProperty | null | undefined = null;
  branch_length_collapse_data: Alcmonavis.CollapseData = {} as Alcmonavis.CollapseData;
  branch_length_collapse_level = -1;
  colorPickerData: Alcmonavis.ColourPickerData | null | undefined = null;
  colorsForColorPicker: string[] | null | undefined = null;
  currentLabelColorVisualization: string | null | undefined = null;
  currentNodeBorderColorVisualization: string | null | undefined = null;
  currentNodeFillColorVisualization: string | null | undefined = null;
  currentNodeShapeVisualization: string | null | undefined = null;
  currentNodeSizeVisualization: string | null | undefined = null;
  depth_collapse_level = -1;
  displayHeight = 0;
  displayWidth = 0;
  dynahide_counter = 0;
  dynahide_factor = 0;
  external_nodes = 0;
  searchQueries: string[] = [];
  foundNodes0 = new Set<Forester.phylo>();
  foundNodes1 = new Set<Forester.phylo>();
  foundSum = 0;
  i = 0;
  id!: string;
  intervalId = 0;
  legendColorScales: Dict<MappingFunction> = {};
  legendShapeScales: Dict<MappingFunction> = {};
  legendSizeScales: Dict<MappingFunction> = {};
  maxLabelLength = 0;
  msa_residue_vis_curr_res_pos = 0;
  nodeVisualizations!: Dict<Alcmonavis.NodeVisualisation>;
  specialVisualizations!: Dict<Alcmonavis.SpecialVisulaisation>; //BM ? //~~
  offsetTop = 0;
  options: Alcmonavis.Options | null | undefined = null;
  rank_collapse_level = -1;
  root!: Alcmonavis.phylo;
  scale: number | null | undefined = null;
  searchBox0Empty = true;
  searchBox1Empty = true;
  settings: Alcmonavis.Settings | null | undefined = null;
  showColorPicker = false;
  showLegends = true;
  superTreeRoots: Alcmonavis.phylo[] = [];
  backTreeRoots: Alcmonavis.phylo[] = [];
  forwardTreeRoots: Alcmonavis.phylo[] = [];
  currentParentNode: Alcmonavis.phylo | undefined = undefined;
  svgGroup!: d3.Selection<any>;
  totalSearchedWithData = 0;
  translate: [number, number] | null | undefined = null;
  treeData!: Alcmonavis.phylo;
  treeFn!: Alcmonavis.CustomCluster<Alcmonavis.phylo>;
  usedColorCategories = new Set<string>();
  visualizations: Alcmonavis.Visualisations | null | undefined = null;
  visualizations2 = null;
  w!: number;
  yScale!: d3.scale.Linear<number, number>;
  zoomListener!: d3.behavior.Zoom<unknown>;
  zoomed_x_or_y = false;
  node_mouseover_div!: d3.Selection<any>;
  visualizations2_color!: string;
  visualizations3_color!: string;
  visualizations2_applies_to_ref!: string;
  visualizations3_applies_to_ref!: string;
  visualizations2_property_datatype!: string;
  visualizations3_property_datatype!: string;
  visualizations2_property_applies_to!: string;
  visualizations3_property_applies_to!: string;

  eventhandlers: Dict<((val?: string | number | boolean) => void)[]> = {};
  preemptiveHandlers: Dict<string | number | boolean | undefined> = {};

  constructor(
    id: string,
    phylo: Alcmonavis.phylo | undefined | null,
    options: Alcmonavis.Options | undefined | null,
    settings: Alcmonavis.Settings,
    nodeVisualizations?: Dict<Alcmonavis.NodeVisualisation>,
    specialVisualizations?: Dict<Alcmonavis.SpecialVisulaisation>,
  ) {
    $('html').on('click', (d) => {
      var attrClass = d.target.getAttribute('class');
      if (attrClass !== 'nodeCircleOptions') {
        this.removeTooltips();
      }
      if (attrClass === AP.BASE_BACKGROUND) {
        if (this.showColorPicker === true) {
          this.removeColorPicker();
        }
      }
    });

    const self = this;

    this.launch(id, phylo, options, settings, nodeVisualizations, specialVisualizations);
  }

  AddHandler = (event: string, handler: (val?: string | number | boolean) => void) => {
    if (!(event in this.eventhandlers)) {
      this.eventhandlers[event] = [handler];
    } else if (!~this.eventhandlers[event].indexOf(handler)) {
      this.eventhandlers[event].push(handler);
    }
    if (event in this.preemptiveHandlers) {
      handler(this.preemptiveHandlers[event]);
    }
  };

  RemoveHandler = (event: string, handler?: (val?: string | number | boolean) => void) => {
    if (event in this.eventhandlers) {
      if (handler && !!~this.eventhandlers[event].indexOf(handler)) {
        const index = this.eventhandlers[event].indexOf(handler);
        this.eventhandlers[event].splice(index, 1);
      } else {
        this.eventhandlers[event].length = 0;
      }
    }
    delete this.preemptiveHandlers[event];
  };

  TriggerHandler = (event: string, value?: string | number | boolean) => {
    if (event in this.eventhandlers) {
      this.eventhandlers[event].forEach((h) => h(value));
    }
    this.preemptiveHandlers[event] = value;
  };

  branchLengthScaling = (nodes: Alcmonavis.phylo[], width: number) => {
    const bl = (node: Forester.phylo) => {
      if (!node.branch_length || node.branch_length < 0 || !this.basicTreeProperties) {
        return 0;
      } else if (!node.parent || !node.parent.parent) {
        return this.basicTreeProperties.averageBranchLength * 0.5;
      }
      return node.branch_length;
    };

    //if (this.root) {
    if (this.root.parent) {
      this.root.parent.distToRoot = 0;
    }
    forester.preOrderTraversalAll(this.root, function (n: Alcmonavis.phylo) {
      n.distToRoot = (n.parent ? n.parent.distToRoot : 0) + bl(n);
    });
    var distsToRoot = nodes.map(function (n) {
      return n.distToRoot;
    });

    var yScale = d3.scale
      .linear()
      .domain([0, d3.max(distsToRoot)])
      .range([0, width]);
    forester.preOrderTraversalAll(this.root, function (n) {
      n.y = yScale(n.distToRoot);
    });
    return yScale;
    //}
    //return d3.scale.linear().domain([0, 0]).range([0, width]);
  };

  zoom = () => {
    const event: d3.ZoomEvent = d3.event as d3.ZoomEvent;
    if (event.sourceEvent && (event.sourceEvent as KeyboardEvent).shiftKey) {
      if (this.scale === null) {
        this.scale = this.zoomListener.scale();
        this.translate = this.zoomListener.translate();
      }
    } else {
      if (this.scale && this.translate) {
        this.zoomListener.scale(this.scale);
        this.zoomListener.translate(this.translate);
        this.svgGroup.attr('transform', 'translate(' + this.translate + ')scale(' + this.scale + ')');
        this.scale = null;
        this.translate = null;
      } else {
        this.svgGroup.attr('transform', 'translate(' + event.translate + ')scale(' + event.scale + ')');
      }
    }
  };

  centerNode = (source: Alcmonavis.phylo, x: number, y: number) => {
    var scale = this.zoomListener.scale();
    if (!x) {
      x = -source.y0;
      if (this.settings && this.settings.enableDynamicSizing) {
        x = x * scale + +this.baseSvg.attr('width') / 2;
      } else {
        x = x * scale + this.displayWidth / 2;
      }
    }
    if (!y) {
      y = 0;
    }
    d3.select('g').attr('transform', 'translate(' + x + ',' + y + ')scale(' + scale + ')');
    this.zoomListener.scale(scale);
    this.zoomListener.translate([x, y]);
  };

  calcMaxTreeLengthForDisplay = () => {
    return SettingsDeclared(this.settings) && OptionsDeclared(this.options)
      ? this.settings.rootOffset +
          this.options.nodeLabelGap +
          AP.LABEL_SIZE_CALC_ADDITION +
          this.maxLabelLength * (this.options.externalNodeFontSize as number) * AP.LABEL_SIZE_CALC_FACTOR
      : 0;
  };

  isCanDoMsaResidueVisualizations = (): boolean => {
    return (
      (SettingsDeclared(this.settings) &&
        this.settings.enableNodeVisualizations === true &&
        this.settings.enableMsaResidueVisualizations === true &&
        this.basicTreeProperties &&
        this.basicTreeProperties.alignedMolSeqs === true &&
        this.basicTreeProperties &&
        this.basicTreeProperties.maxMolSeqLength &&
        this.basicTreeProperties.maxMolSeqLength > 1) ||
      false
    );
  };

  isAddVisualization2 = () => {
    //~~
    return true;
  };

  isAddVisualization3 = () => {
    //~~~
    return true;
  };

  // ----------------------------
  // Functions for node tooltips
  // ----------------------------

  mouseover = () => {
    this.node_mouseover_div.transition().duration(300).style('opacity', 1);
  };

  mousemove = (d: Alcmonavis.phylo) => {
    this.node_mouseover_div
      .text(d.name || '')
      .style('left', (d3.event as MouseEvent).pageX + 'px')
      .style('top', (d3.event as MouseEvent).pageY + 'px');
  };

  mouseout = () => {
    this.node_mouseover_div.transition().duration(300).style('opacity', 1e-6);
  };

  // ----------------------------

  createVisualization = (
    label: string | undefined,
    description: string | undefined,
    field: keyof Forester.phylo | null | undefined,
    cladePropertyRef: string | null | undefined, //?
    isRegex: boolean,
    mapping: Dict<string> | null | undefined,
    mappingFn: MappingFunction | null | undefined, // mappingFn is a scale
    scaleType: string,
    altMappingFn?: d3.scale.Linear<number, number> | null | undefined,
  ) => {
    // if (arguments.length < 8) {
    //     throw( 'expected at least 8 arguments, got ' + arguments.length);
    // }

    if (!label || label.length < 1) {
      throw 'need to have label';
    }
    var visualization = {} as Alcmonavis.Visualisation;
    visualization.label = label;
    if (description) {
      visualization.description = description;
    }
    if (field) {
      if (cladePropertyRef) {
        throw 'need to have either field or clade property ref (but not both)';
      }
      visualization.field = field;
    } else if (cladePropertyRef) {
      visualization.cladePropertyRef = cladePropertyRef;
    } else {
      throw 'need to have either field or clade property ref';
    }
    visualization.isRegex = isRegex;
    if (mapping) {
      if (mappingFn) {
        throw 'need to have either mapping or mappingFn';
      }
      visualization.mapping = mapping;
    } else if (mappingFn) {
      visualization.mappingFn = mappingFn;
      if (scaleType === AP.ORDINAL_SCALE) {
        if (mappingFn.domain() && mappingFn.range() && mappingFn.domain().length > mappingFn.range().length) {
          if (altMappingFn && altMappingFn.domain() && altMappingFn.range()) {
            visualization.mappingFn = altMappingFn;
            scaleType = AP.LINEAR_SCALE;
          } else {
            var s = cladePropertyRef ? cladePropertyRef : field;
            console.log(
              AP.WARNING +
                ': Ordinal scale mapping for ' +
                label +
                ' (' +
                s +
                '): domain > range: ' +
                mappingFn.domain().length +
                ' > ' +
                mappingFn.range().length,
            );
          }
        }
      }
    } else {
      throw 'need to have either mapping or mappingFn';
    }
    visualization.scaleType = scaleType;
    return visualization;
  };

  initializeNodeVisualizations = (nodeProperties: Dict<Set<string>>) => {
    if (this.nodeVisualizations) {
      for (var key in this.nodeVisualizations) {
        if (this.nodeVisualizations.hasOwnProperty(key)) {
          // '...iterate over the properties of an object without executing on inherited properties.'

          var nodeVisualization = this.nodeVisualizations[key];

          if (nodeVisualization.label) {
            var scaleType = '';
            if (
              nodeVisualization.shapes &&
              Array.isArray(nodeVisualization.shapes) &&
              nodeVisualization.shapes.length > 0
            ) {
              var shapeScale: d3.scale.Ordinal<string, Alcmonavis.Shape> | null | undefined = null;
              if (nodeVisualization.label === AP.MSA_RESIDUE) {
                const domain: string[] =
                  (this.basicTreeProperties &&
                    this.basicTreeProperties.molSeqResiduesPerPosition &&
                    this.basicTreeProperties.molSeqResiduesPerPosition[0]) ||
                  [];
                shapeScale = d3.scale.ordinal<Alcmonavis.Shape>().range(nodeVisualization.shapes).domain(domain);
                scaleType = AP.ORDINAL_SCALE;
              } else if (
                nodeVisualization.cladeRef &&
                nodeProperties[nodeVisualization.cladeRef] &&
                forester.setToArray(nodeProperties[nodeVisualization.cladeRef]).length > 0
              ) {
                shapeScale = d3.scale
                  .ordinal<Alcmonavis.Shape>()
                  .range(nodeVisualization.shapes)
                  .domain(forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]));
                scaleType = AP.ORDINAL_SCALE;
              } else if (
                nodeVisualization.field &&
                nodeProperties[nodeVisualization.field] &&
                forester.setToArray(nodeProperties[nodeVisualization.field]).length > 0
              ) {
                shapeScale = d3.scale
                  .ordinal<Alcmonavis.Shape>()
                  .range(nodeVisualization.shapes)
                  .domain(forester.setToSortedArray(nodeProperties[nodeVisualization.field]));
                scaleType = AP.ORDINAL_SCALE;
              }

              if (shapeScale) {
                this.addNodeShapeVisualization(
                  nodeVisualization.label,
                  nodeVisualization.description,
                  nodeVisualization.field ? nodeVisualization.field : null,
                  nodeVisualization.cladeRef ? nodeVisualization.cladeRef : null,
                  nodeVisualization.regex,
                  null,
                  shapeScale,
                  scaleType,
                );
              }
            }

            if (nodeVisualization.colors) {
              // TODO: Not dealing with nodeVisualization.field, yet.
              if (
                (nodeVisualization.cladeRef &&
                  nodeProperties[nodeVisualization.cladeRef] &&
                  forester.setToArray(nodeProperties[nodeVisualization.cladeRef]).length > 0) ||
                nodeVisualization.label === AP.MSA_RESIDUE
              ) {
                var colorScale: MappingFunction | null = null;
                var altColorScale: d3.scale.Linear<number, number> | null = null;

                if (Array.isArray(nodeVisualization.colors)) {
                  scaleType = AP.LINEAR_SCALE;
                  if (nodeVisualization.colors.length === 3) {
                    colorScale = d3.scale
                      .linear()
                      .range(nodeVisualization.colors)
                      .domain(forester.calcMinMeanMaxInSet(nodeProperties[nodeVisualization.cladeRef]));
                  } else if (nodeVisualization.colors.length === 2) {
                    colorScale = d3.scale
                      .linear()
                      .range(nodeVisualization.colors)
                      .domain(forester.calcMinMaxInSet(nodeProperties[nodeVisualization.cladeRef]));
                  } else {
                    throw 'Number of colors has to be either 2 or 3';
                  }
                }

                if (Array.isArray(nodeVisualization.colorsAlt)) {
                  if (nodeVisualization.colorsAlt.length === 3) {
                    altColorScale = d3.scale
                      .linear()
                      .range(nodeVisualization.colorsAlt)
                      .domain(forester.calcMinMeanMaxInSet(nodeProperties[nodeVisualization.cladeRef]));
                  } else if (nodeVisualization.colorsAlt.length === 2) {
                    altColorScale = d3.scale
                      .linear()
                      .range(nodeVisualization.colorsAlt)
                      .domain(forester.calcMinMaxInSet(nodeProperties[nodeVisualization.cladeRef]));
                  } else {
                    throw 'Number of colors has to be either 2 or 3';
                  }
                }

                if (isString(nodeVisualization.colors) && nodeVisualization.colors.length > 0) {
                  scaleType = AP.ORDINAL_SCALE;
                  if (nodeVisualization.label === AP.MSA_RESIDUE) {
                    colorScale = d3.scale.category20().domain(this.basicTreeProperties!.molSeqResiduesPerPosition![0]);
                    this.usedColorCategories.add('category20');
                  } else {
                    if (nodeVisualization.colors === 'category20') {
                      colorScale = d3.scale
                        .category20()
                        .domain(forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]));
                      this.usedColorCategories.add('category20');
                    } else if (nodeVisualization.colors === 'category20b') {
                      colorScale = d3.scale
                        .category20b()
                        .domain(forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]));
                      this.usedColorCategories.add('category20b');
                    } else if (nodeVisualization.colors === 'category20c') {
                      colorScale = d3.scale
                        .category20c()
                        .domain(forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]));
                      this.usedColorCategories.add('category20c');
                    } else if (nodeVisualization.colors === 'category10') {
                      colorScale = d3.scale
                        .category10()
                        .domain(forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]));
                      this.usedColorCategories.add('category10');
                    } else if (nodeVisualization.colors === 'category50') {
                      colorScale = AP.category50<string>().domain(
                        forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]),
                      );
                      this.usedColorCategories.add('category50');
                    } else if (nodeVisualization.colors === 'category50b') {
                      colorScale = AP.category50b<string>().domain(
                        forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]),
                      );
                      this.usedColorCategories.add('category50b');
                    } else if (nodeVisualization.colors === 'category50c') {
                      colorScale = AP.category50c<string>().domain(
                        forester.setToSortedArray(nodeProperties[nodeVisualization.cladeRef]),
                      );
                      this.usedColorCategories.add('category50c');
                    } else {
                      throw 'do not know how to process ' + nodeVisualization.colors;
                    }
                  }
                }

                if (colorScale) {
                  this.addLabelColorVisualization(
                    nodeVisualization.label,
                    nodeVisualization.description,
                    null,
                    nodeVisualization.cladeRef,
                    nodeVisualization.regex,
                    null,
                    colorScale,
                    scaleType,
                    altColorScale,
                  );

                  this.addNodeFillColorVisualization(
                    nodeVisualization.label,
                    nodeVisualization.description,
                    null,
                    nodeVisualization.cladeRef,
                    nodeVisualization.regex,
                    null,
                    colorScale,
                    scaleType,
                    altColorScale,
                  );

                  this.addNodeBorderColorVisualization(
                    nodeVisualization.label,
                    nodeVisualization.description,
                    null,
                    nodeVisualization.cladeRef,
                    nodeVisualization.regex,
                    null,
                    colorScale,
                    scaleType,
                    altColorScale,
                  );
                }
              }
            }

            if (
              nodeVisualization.sizes &&
              Array.isArray(nodeVisualization.sizes) &&
              nodeVisualization.sizes.length > 0
            ) {
              if (
                nodeVisualization.cladeRef &&
                nodeProperties[nodeVisualization.cladeRef] &&
                forester.setToArray(nodeProperties[nodeVisualization.cladeRef]).length > 0
              ) {
                var sizeScale = null;
                var scaleType = AP.LINEAR_SCALE;
                if (nodeVisualization.sizes.length === 3) {
                  sizeScale = d3.scale
                    .linear()
                    .range(nodeVisualization.sizes)
                    .domain(forester.calcMinMeanMaxInSet(nodeProperties[nodeVisualization.cladeRef]));
                } else if (nodeVisualization.sizes.length === 2) {
                  sizeScale = d3.scale
                    .linear()
                    .range(nodeVisualization.sizes)
                    .domain(forester.calcMinMaxInSet(nodeProperties[nodeVisualization.cladeRef]));
                } else {
                  throw 'Number of sizes has to be either 2 or 3';
                }
                if (sizeScale) {
                  this.addNodeSizeVisualization(
                    nodeVisualization.label,
                    nodeVisualization.description,
                    null,
                    nodeVisualization.cladeRef,
                    nodeVisualization.regex,
                    null,
                    sizeScale,
                    scaleType,
                  );
                }
              }
            }
          }
        }
      }
    }
  };

  addNodeSizeVisualization = (
    label: string,
    description: string,
    field: keyof Forester.phylo | null,
    cladePropertyRef: string,
    isRegex: boolean,
    mapping: Dict<string> | null,
    mappingFn: MappingFunction | null | undefined,
    scaleType: string,
  ) => {
    // if (arguments.length != 8) {
    //     throw( 'expected 8 arguments, got ' + arguments.length);
    // }
    if (!this.visualizations) {
      this.visualizations = {} as Alcmonavis.Visualisations;
    }
    if (!this.visualizations.nodeSize) {
      this.visualizations.nodeSize = {} as Dict<Alcmonavis.Visualisation>;
    }
    if (this.visualizations.nodeSize[label]) {
      throw 'node size visualization for "' + label + '" already exists';
    }
    const vis = this.createVisualization(
      label,
      description,
      field,
      cladePropertyRef,
      isRegex,
      mapping,
      mappingFn,
      scaleType,
    );
    if (vis) {
      this.visualizations.nodeSize[vis.label!] = vis;
    }
  };

  addNodeFillColorVisualization = (
    label: string,
    description: string,
    field: keyof Forester.phylo | null | undefined,
    cladePropertyRef: string | null | undefined,
    isRegex: boolean,
    mapping: Dict<string> | null | undefined,
    mappingFn: MappingFunction | null | undefined,
    scaleType: string,
    altMappingFn?: d3.scale.Linear<number, number> | null | undefined,
  ) => {
    // if (arguments.length < 8) {
    //     throw( 'expected at least 8 arguments, got ' + arguments.length);
    // }
    if (!this.visualizations) {
      this.visualizations = {};
    }
    if (!this.visualizations.nodeFillColor) {
      this.visualizations.nodeFillColor = {};
    }
    if (this.visualizations.nodeFillColor[label]) {
      throw 'node fill color visualization for "' + label + '" already exists';
    }
    const vis = this.createVisualization(
      label,
      description,
      field,
      cladePropertyRef,
      isRegex,
      mapping,
      mappingFn,
      scaleType,
      altMappingFn,
    );
    if (vis) {
      this.visualizations.nodeFillColor[vis.label!] = vis;
    }
  };

  addNodeBorderColorVisualization = (
    label: string,
    description: string,
    field: keyof Forester.phylo | null | undefined,
    cladePropertyRef: string,
    isRegex: boolean,
    mapping: Dict<string> | null | undefined,
    mappingFn: MappingFunction | null,
    scaleType: string,
    altMappingFn?: d3.scale.Linear<number, number> | null | undefined,
  ) => {
    // if (arguments.length < 8) {
    //     throw( 'expected at least 8 arguments, got ' + arguments.length);
    // }
    if (!this.visualizations) {
      this.visualizations = {};
    }
    if (!this.visualizations.nodeBorderColor) {
      this.visualizations.nodeBorderColor = {};
    }
    if (this.visualizations.nodeBorderColor[label]) {
      throw 'node border color visualization for "' + label + '" already exists';
    }
    const vis = this.createVisualization(
      label,
      description,
      field,
      cladePropertyRef,
      isRegex,
      mapping,
      mappingFn,
      scaleType,
      altMappingFn,
    );
    if (vis) {
      this.visualizations.nodeBorderColor[vis.label!] = vis;
    }
  };

  addNodeShapeVisualization = (
    label: string,
    description: string,
    field: keyof Forester.phylo | null | undefined,
    cladePropertyRef: string | null | undefined,
    isRegex: boolean,
    mapping: Dict<string> | null | undefined,
    mappingFn: d3.scale.Ordinal<string, string>,
    scaleType: string,
  ) => {
    // if (arguments.length != 8) {
    //     throw( 'expected 8 arguments, got ' + arguments.length);
    // }
    if (!this.visualizations) {
      this.visualizations = {};
    }
    if (!this.visualizations.nodeShape) {
      this.visualizations.nodeShape = {};
    }
    if (this.visualizations.nodeShape[label]) {
      throw 'node shape visualization for "' + label + '" already exists';
    }
    const vis = this.createVisualization(
      label,
      description,
      field,
      cladePropertyRef,
      isRegex,
      mapping,
      mappingFn,
      scaleType,
    );
    if (vis) {
      this.visualizations.nodeShape[vis.label!] = vis;
    }
  };

  addLabelColorVisualization = (
    label: string,
    description: string,
    field: keyof Forester.phylo | null | undefined,
    cladePropertyRef: string | null | undefined,
    isRegex: boolean,
    mapping: Dict<string> | null | undefined,
    mappingFn: MappingFunction,
    scaleType: string,
    altMappingFn?: d3.scale.Linear<number, number> | null,
  ) => {
    // if (arguments.length < 8) {
    //     throw( 'expected at least 8 arguments, got ' + arguments.length);
    // }
    if (!this.visualizations) {
      this.visualizations = {};
    }
    if (!this.visualizations.labelColor) {
      this.visualizations.labelColor = {};
    }
    if (this.visualizations.labelColor[label]) {
      throw 'label color visualization for "' + label + '" already exists';
    }
    const vis = this.createVisualization(
      label,
      description,
      field,
      cladePropertyRef,
      isRegex,
      mapping,
      mappingFn,
      scaleType,
      altMappingFn,
    );
    if (vis) {
      this.visualizations.labelColor[vis.label!] = vis;
    }
  };

  resetVis = () => {
    forester.preOrderTraversal(this.root, function (n) {
      n.hasVis = undefined;
    });
  };

  removeColorLegend = (id: string) => this.baseSvg.selectAll('g.' + id).remove();

  removeShapeLegend = (id: string) => this.baseSvg.selectAll('g.' + id).remove();

  removeSizeLegend = (id: string) => this.baseSvg.selectAll('g.' + id).remove();

  makeColorLegend = (
    id: string,
    xPos: number,
    yPos: number,
    colorScale: d3.scale.Ordinal<string, string> | d3.scale.Linear<number, number>,
    scaleType: string,
    label: string | undefined,
    description: string,
  ) => {
    if (!SettingsDeclared(this.settings)) throw 'Settings not set';
    if (!label) {
      throw 'legend label is missing';
    }

    var linearRangeLabel = ' (gradient)';
    var outOfRangeSymbol = ' *';
    var isLinearRange = scaleType === AP.LINEAR_SCALE;
    var linearRangeLength = 0;
    if (isLinearRange) {
      label += linearRangeLabel;
      linearRangeLength = colorScale.domain().length;
    } else {
      if (colorScale.domain().length > colorScale.range().length) {
        label += outOfRangeSymbol;
      }
    }

    var counter = 0;

    var legendRectSize = 10;
    var legendSpacing = 4;

    var xCorrectionForLabel = -1;
    var yFactorForLabel = -1.5;
    var yFactorForDesc = -0.5;

    var legend = this.baseSvg.selectAll('g.' + id).data<number | string>(colorScale.domain());

    var legendEnter = legend.enter().append('g').attr('class', id);

    var fs = SettingsDeclared(this.settings) && this.settings.controlsFontSize.toString() + 'px';

    legendEnter
      .append('rect')
      .style('cursor', 'pointer')
      .attr('width', (null as unknown) as d3.Primitive)
      .attr('height', (null as unknown) as d3.Primitive)
      .on('click', (clickedName, clickedIndex) => {
        this.legendColorRectClicked(colorScale, label!, description, clickedName, clickedIndex);
      });

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'normal')
      .style('text-decoration', 'none');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND_LABEL)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'bold')
      .style('text-decoration', 'none');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND_DESCRIPTION)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'bold')
      .style('text-decoration', 'none');

    var legendUpdate = legend
      .transition()
      .duration(0)
      .attr('transform', function (_d, i) {
        ++counter;
        var height = legendRectSize;
        var x = xPos;
        var y = yPos + i * height;
        return 'translate(' + x + ',' + y + ')';
      });

    legendUpdate
      .select('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', scaleSwitch(colorScale))
      .style('stroke', scaleSwitch(colorScale));

    legendUpdate
      .select('text.' + AP.LEGEND)
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text((d, i) => {
        if (isLinearRange) {
          if (i === 0) {
            return d + ' (min)';
          } else if ((linearRangeLength === 2 && i === 1) || (linearRangeLength === 3 && i === 2)) {
            return d + ' (max)';
          } else if (linearRangeLength === 3 && i === 1) {
            return (
              this.preciseRound(+d, (this.options && this.options.decimalsForLinearRangeMeanValue) || 0) + ' (mean)'
            );
          }
        }
        return d;
      });

    legendUpdate
      .select('text.' + AP.LEGEND_LABEL)
      .attr('x', xCorrectionForLabel)
      .attr('y', yFactorForLabel * legendRectSize)
      .text(function (d, i) {
        if (i === 0) {
          return label || '';
        }
        return '';
      });

    legendUpdate
      .select('text.' + AP.LEGEND_DESCRIPTION)
      .attr('x', xCorrectionForLabel)
      .attr('y', yFactorForDesc * legendRectSize)
      .text((d, i) => {
        if (i === 0 && description) {
          if (description === AP.MSA_RESIDUE) {
            return description + ' ' + (this.msa_residue_vis_curr_res_pos + 1);
          }
          return description;
        }
        return '';
      });

    legend.exit().remove();

    return counter;
  };

  makeShapeLegend = (
    id: string,
    xPos: number,
    yPos: number,
    shapeScale: MappingFunction,
    label: string,
    description: string,
  ) => {
    if (!SettingsDeclared(this.settings)) throw 'Settings not set';

    if (!label) {
      throw 'legend label is missing';
    }

    var outOfRangeSymbol = ' *';

    if (shapeScale.domain().length > shapeScale.range().length) {
      label += outOfRangeSymbol;
    }

    var counter = 0;

    var legendRectSize = 10;
    var legendSpacing = 4;

    var xCorrectionForLabel = -1;
    var yFactorForLabel = -1.5;
    var yFactorForDesc = -0.5;

    var legend = this.baseSvg.selectAll('g.' + id).data<string | number>(shapeScale.domain());

    var legendEnter = legend.enter().append('g').attr('class', id);

    var fs = this.settings!.controlsFontSize!.toString() + 'px';

    legendEnter.append('path');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'normal')
      .style('text-decoration', 'none');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND_LABEL)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'bold')
      .style('text-decoration', 'none');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND_DESCRIPTION)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'bold')
      .style('text-decoration', 'none');

    var legendUpdate = legend.attr('transform', function (d, i) {
      ++counter;
      var height = legendRectSize;
      var x = xPos;
      var y = yPos + i * height;
      return 'translate(' + x + ',' + y + ')';
    });

    var values: (string | number)[] = [];

    legendUpdate
      .select('text.' + AP.LEGEND)
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function (d) {
        values.push(d);
        return d;
      });

    legendUpdate
      .select('text.' + AP.LEGEND_LABEL)
      .attr('x', xCorrectionForLabel)
      .attr('y', yFactorForLabel * legendRectSize)
      .text(function (d, i) {
        if (i === 0) {
          return label;
        }
        return '';
      });

    legendUpdate
      .select('text.' + AP.LEGEND_DESCRIPTION)
      .attr('x', xCorrectionForLabel)
      .attr('y', yFactorForDesc * legendRectSize)
      .text((d, i) => {
        if (i === 0 && description) {
          if (description === AP.MSA_RESIDUE) {
            return description + ' ' + (this.msa_residue_vis_curr_res_pos + 1);
          }
          return description;
        }
        return '';
      });

    legendUpdate
      .select('path')
      .attr('transform', function () {
        return 'translate(' + 1 + ',' + 3 + ')';
      })
      .attr(
        'd',
        d3.svg
          .symbol()
          .size(function () {
            return 20;
          })
          .type((_, i) => scaleSwitch(shapeScale)(values[i]) as string),
      )
      .style('fill', 'none')
      .style('stroke', (this.options && this.options.branchColorDefault) || AP.WHITE);

    legend.exit().remove();

    return counter;
  };

  makeSizeLegend = (
    id: string,
    xPos: number,
    yPos: number,
    sizeScale: MappingFunction,
    scaleType: string,
    label: string,
    description: string,
  ) => {
    if (!SettingsDeclared(this.settings)) throw 'Settings not set';

    if (!label) {
      throw 'legend label is missing';
    }
    var linearRangeLabel = ' (range)';
    var isLinearRange = scaleType === AP.LINEAR_SCALE;
    var linearRangeLength = 0;
    if (isLinearRange) {
      label += linearRangeLabel;
      linearRangeLength = sizeScale.domain().length;
    }

    var counter = 0;

    var legendRectSize = 10;
    var legendSpacing = 4;

    var xCorrectionForLabel = -1;
    var yFactorForLabel = -1.5;
    var yFactorForDesc = -0.5;

    var legend = this.baseSvg.selectAll('g.' + id).data<string | number>(sizeScale.domain());

    var legendEnter = legend.enter().append('g').attr('class', id);

    var fs = this.settings.controlsFontSize.toString() + 'px';

    legendEnter.append('path');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'normal')
      .style('text-decoration', 'none');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND_LABEL)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings!.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'bold')
      .style('text-decoration', 'none');

    legendEnter
      .append('text')
      .attr('class', AP.LEGEND_DESCRIPTION)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'bold')
      .style('text-decoration', 'none');

    var legendUpdate = legend.attr('transform', function (d, i) {
      ++counter;
      var height = legendRectSize;
      var x = xPos;
      var y = yPos + i * height;
      return 'translate(' + x + ',' + y + ')';
    });

    var values: (string | number)[] = [];

    legendUpdate
      .select('text.' + AP.LEGEND)
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text((d, i) => {
        values.push(d);
        if (isLinearRange) {
          if (i === 0) {
            return d + ' (min)';
          } else if ((linearRangeLength === 2 && i === 1) || (linearRangeLength === 3 && i === 2)) {
            return d + ' (max)';
          } else if (linearRangeLength === 3 && i === 1) {
            return this.preciseRound(+d, this.options!.decimalsForLinearRangeMeanValue!) + ' (mean)';
          }
        }
        return d;
      });

    legendUpdate
      .select('text.' + AP.LEGEND_LABEL)
      .attr('x', xCorrectionForLabel)
      .attr('y', yFactorForLabel * legendRectSize)
      .text(function (d, i) {
        if (i === 0) {
          return label;
        }
        return '';
      });

    legendUpdate
      .select('text.' + AP.LEGEND_DESCRIPTION)
      .attr('x', xCorrectionForLabel)
      .attr('y', yFactorForDesc * legendRectSize)
      .text(function (d, i) {
        if (i === 0 && description) {
          return description;
        }
        return '';
      });

    legendUpdate
      .select('path')
      .attr('transform', () => {
        return 'translate(' + 1 + ',' + 3 + ')';
      })
      .attr(
        'd',
        d3.svg
          .symbol()
          .size((d, i) => {
            var scale = this.zoomListener.scale();
            return scale * this.options!.nodeSizeDefault! * +scaleSwitch(sizeScale)(values[i]);
          })
          .type(() => 'circle'),
      )
      .style('fill', 'none')
      .style('stroke', this.options!.branchColorDefault || AP.WHITE);

    legend.exit().remove();

    return counter;
  };

  preciseRound = (num: number, decimals: number): string => {
    var t = Math.pow(10, decimals);
    return (
      Math.round(num * t + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) / t
    ).toFixed(decimals);
  };

  addLegends = () => {
    if (!OptionsDeclared(this.options)) {
      throw 'Options not set';
    }

    var xPos = this.options.visualizationsLegendXpos || 0;
    var yPos = this.options.visualizationsLegendYpos || 0;
    var xPosIncr = 0;
    var yPosIncr = 0;
    var yPosIncrConst = 0;
    if (this.options.visualizationsLegendOrientation === AP.HORIZONTAL) {
      xPosIncr = 130;
    } else if (this.options!.visualizationsLegendOrientation === AP.VERTICAL) {
      yPosIncr = 10;
      yPosIncrConst = 40;
    } else {
      throw 'unknown direction for legends ' + this.options.visualizationsLegendOrientation;
    }
    var label = '';
    var desc: string | null | undefined = '';
    var counter = 0;
    var scaleType = '';

    if (
      this.showLegends &&
      this.legendColorScales[AP.LEGEND_LABEL_COLOR] &&
      this.visualizations &&
      this.visualizations.labelColor &&
      this.currentLabelColorVisualization &&
      this.visualizations.labelColor[this.currentLabelColorVisualization]
    ) {
      this.removeColorLegend(AP.LEGEND_LABEL_COLOR);
      label = 'Label Color';
      desc = this.currentLabelColorVisualization;

      scaleType = this.visualizations.labelColor[this.currentLabelColorVisualization].scaleType;
      counter = this.makeColorLegend(
        AP.LEGEND_LABEL_COLOR,
        xPos,
        yPos,
        this.legendColorScales[AP.LEGEND_LABEL_COLOR],
        scaleType,
        label,
        desc,
      );
      xPos += xPosIncr;
      yPos += counter * yPosIncr + yPosIncrConst;
    } else {
      this.removeColorLegend(AP.LEGEND_LABEL_COLOR);
    }

    if (
      this.showLegends &&
      this.options.showNodeVisualizations &&
      this.legendColorScales[AP.LEGEND_NODE_FILL_COLOR] &&
      this.visualizations &&
      this.visualizations.nodeFillColor &&
      this.currentNodeFillColorVisualization &&
      this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization]
    ) {
      this.removeColorLegend(AP.LEGEND_NODE_FILL_COLOR);
      label = 'Node Fill';
      desc = this.currentNodeFillColorVisualization;
      scaleType = this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization].scaleType;

      counter = this.makeColorLegend(
        AP.LEGEND_NODE_FILL_COLOR,
        xPos,
        yPos,
        this.legendColorScales[AP.LEGEND_NODE_FILL_COLOR],
        scaleType,
        label,
        desc,
      );
      xPos += xPosIncr;
      yPos += counter * yPosIncr + yPosIncrConst;
    } else {
      this.removeColorLegend(AP.LEGEND_NODE_FILL_COLOR);
    }

    if (
      this.showLegends &&
      this.options.showNodeVisualizations &&
      this.legendColorScales[AP.LEGEND_NODE_BORDER_COLOR] &&
      this.visualizations &&
      this.visualizations.nodeBorderColor &&
      this.currentNodeBorderColorVisualization &&
      this.visualizations.nodeBorderColor[this.currentNodeBorderColorVisualization]
    ) {
      this.removeColorLegend(AP.LEGEND_NODE_BORDER_COLOR);
      label = 'Node Border';
      desc = this.currentNodeBorderColorVisualization;
      scaleType = this.visualizations.nodeBorderColor[this.currentNodeBorderColorVisualization!].scaleType;

      counter = this.makeColorLegend(
        AP.LEGEND_NODE_BORDER_COLOR,
        xPos,
        yPos,
        this.legendColorScales[AP.LEGEND_NODE_BORDER_COLOR],
        scaleType,
        label,
        desc,
      );
      xPos += xPosIncr;
      yPos += counter * yPosIncr + yPosIncrConst;
    } else {
      this.removeColorLegend(AP.LEGEND_NODE_BORDER_COLOR);
    }

    if (this.showLegends && this.options.showNodeVisualizations && this.legendShapeScales[AP.LEGEND_NODE_SHAPE]) {
      label = 'Node Shape';
      desc = this.currentNodeShapeVisualization || '';
      counter = this.makeShapeLegend(
        AP.LEGEND_NODE_SHAPE,
        xPos,
        yPos,
        this.legendShapeScales[AP.LEGEND_NODE_SHAPE],
        label,
        desc,
      );
      xPos += xPosIncr;
      yPos += counter * yPosIncr + yPosIncrConst;
    } else {
      this.removeShapeLegend(AP.LEGEND_NODE_SHAPE);
    }

    if (
      this.showLegends &&
      this.options.showNodeVisualizations &&
      this.legendSizeScales[AP.LEGEND_NODE_SIZE] &&
      this.visualizations &&
      this.visualizations.nodeSize &&
      this.currentNodeSizeVisualization &&
      this.visualizations.nodeSize[this.currentNodeSizeVisualization]
    ) {
      label = 'Node Size';
      desc = this.currentNodeSizeVisualization;
      scaleType = this.visualizations.nodeSize[this.currentNodeSizeVisualization].scaleType;
      this.makeSizeLegend(
        AP.LEGEND_NODE_SIZE,
        xPos,
        yPos,
        this.legendSizeScales[AP.LEGEND_NODE_SIZE],
        scaleType,
        label,
        desc,
      );
    } else {
      this.removeSizeLegend(AP.LEGEND_NODE_SIZE);
    }
  };

  // --------------------------------------------------------------
  // Functions for color picker
  // --------------------------------------------------------------
  obtainPredefinedColors(name: string) {
    var twenty: number[] = [...Array(20).keys()];
    var fifty: number[] = [...Array(50).keys()];
    var colorScale: d3.scale.Ordinal<number, string>;
    var l = 0;
    if (name === 'category20') {
      l = 20;
      colorScale = d3.scale.category20<number>().domain(twenty);
    } else if (name === 'category20b') {
      l = 20;
      colorScale = d3.scale.category20b<number>().domain(twenty);
    } else if (name === 'category20c') {
      l = 20;
      colorScale = d3.scale.category20c<number>().domain(twenty);
    } else if (name === 'category10') {
      l = 10;
      colorScale = d3.scale.category10<number>().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    } else if (name === 'category50') {
      l = 50;
      colorScale = AP.category50<number>().domain(fifty);
    } else if (name === 'category50b') {
      l = 50;
      colorScale = AP.category50b<number>().domain(fifty);
    } else if (name === 'category50c') {
      l = 50;
      colorScale = AP.category50c<number>().domain(fifty);
    } else {
      throw 'do not know ' + name;
    }
    var colors = [];
    for (var i = 0; i < l; ++i) {
      colors.push(colorScale(i));
    }
    return colors;
  }

  addColorPicker = (
    targetScale: d3.scale.Linear<number, number> | d3.scale.Ordinal<string, string>,
    legendLabel: string,
    legendDescription: string,
    clickedName: string | number,
    clickedIndex: number,
  ) => {
    this.colorPickerData = {} as Alcmonavis.ColourPickerData;
    this.colorPickerData.targetScale = targetScale;
    this.colorPickerData.legendLabel = legendLabel;
    this.colorPickerData.legendDescription = legendDescription;
    this.colorPickerData.clickedName = clickedName.toString();
    this.colorPickerData.clickedIndex = clickedIndex;
    this.colorPickerData.clickedOrigColor =
      typeof clickedName === 'number'
        ? (targetScale as d3.scale.Linear<number, number>)(clickedName).toString()
        : (targetScale as d3.scale.Ordinal<string, string>)(clickedName);
    this.showColorPicker = true;
  };

  removeColorPicker = () => {
    this.showColorPicker = false;
    this.colorPickerData = null;
    this.baseSvg.selectAll('g.' + AP.COLOR_PICKER).remove();
  };

  prepareColorsForColorPicker = () => {
    const DEFAULT_COLORS_FOR_COLORPICKER = [
      // Red
      '#FFEBEE',
      '#FFCDD2',
      '#EF9A9A',
      '#E57373',
      '#EF5350',
      '#F44336',
      '#E53935',
      '#D32F2F',
      '#C62828',
      '#B71C1C',
      '#FF8A80',
      '#FF5252',
      '#FF1744',
      '#D50000',
      // Pink
      '#FCE4EC',
      '#F8BBD0',
      '#F48FB1',
      '#F06292',
      '#EC407A',
      '#E91E63',
      '#D81B60',
      '#C2185B',
      '#AD1457',
      '#880E4F',
      '#FF80AB',
      '#FF4081',
      '#F50057',
      '#C51162',
      // Purple
      '#F3E5F5',
      '#E1BEE7',
      '#CE93D8',
      '#BA68C8',
      '#AB47BC',
      '#9C27B0',
      '#8E24AA',
      '#7B1FA2',
      '#6A1B9A',
      '#4A148C',
      '#EA80FC',
      '#E040FB',
      '#D500F9',
      '#AA00FF',
      // Deep Purple
      '#EDE7F6',
      '#D1C4E9',
      '#B39DDB',
      '#9575CD',
      '#7E57C2',
      '#673AB7',
      '#5E35B1',
      '#512DA8',
      '#4527A0',
      '#311B92',
      '#B388FF',
      '#7C4DFF',
      '#651FFF',
      '#6200EA',
      // Indigo
      '#E8EAF6',
      '#C5CAE9',
      '#9FA8DA',
      '#7986CB',
      '#5C6BC0',
      '#3F51B5',
      '#3949AB',
      '#303F9F',
      '#283593',
      '#1A237E',
      '#8C9EFF',
      '#536DFE',
      '#3D5AFE',
      '#304FFE',
      // Blue
      '#E3F2FD',
      '#BBDEFB',
      '#90CAF9',
      '#64B5F6',
      '#42A5F5',
      '#2196F3',
      '#1E88E5',
      '#1976D2',
      '#1565C0',
      '#0D47A1',
      '#82B1FF',
      '#448AFF',
      '#2979FF',
      '#2962FF',
      // Light Blue
      '#E1F5FE',
      '#B3E5FC',
      '#81D4FA',
      '#4FC3F7',
      '#29B6F6',
      '#03A9F4',
      '#039BE5',
      '#0288D1',
      '#0277BD',
      '#01579B',
      '#80D8FF',
      '#40C4FF',
      '#00B0FF',
      '#0091EA',
      // Cyan
      '#E0F7FA',
      '#B2EBF2',
      '#80DEEA',
      '#4DD0E1',
      '#26C6DA',
      '#00BCD4',
      '#00ACC1',
      '#0097A7',
      '#00838F',
      '#006064',
      '#84FFFF',
      '#18FFFF',
      '#00E5FF',
      '#00B8D4',
      // Teal
      '#E0F2F1',
      '#B2DFDB',
      '#80CBC4',
      '#4DB6AC',
      '#26A69A',
      '#009688',
      '#00897B',
      '#00796B',
      '#00695C',
      '#004D40',
      '#A7FFEB',
      '#64FFDA',
      '#1DE9B6',
      '#00BFA5',
      // Green
      '#E8F5E9',
      '#C8E6C9',
      '#A5D6A7',
      '#81C784',
      '#66BB6A',
      '#4CAF50',
      '#43A047',
      '#388E3C',
      '#2E7D32',
      '#1B5E20',
      '#B9F6CA',
      '#69F0AE',
      '#00E676',
      '#00C853',
      // Light Green
      '#F1F8E9',
      '#DCEDC8',
      '#C5E1A5',
      '#AED581',
      '#9CCC65',
      '#8BC34A',
      '#7CB342',
      '#689F38',
      '#558B2F',
      '#33691E',
      '#CCFF90',
      '#B2FF59',
      '#76FF03',
      '#64DD17',
      // Lime
      '#F9FBE7',
      '#F0F4C3',
      '#E6EE9C',
      '#DCE775',
      '#D4E157',
      '#CDDC39',
      '#C0CA33',
      '#AFB42B',
      '#9E9D24',
      '#827717',
      '#F4FF81',
      '#EEFF41',
      '#C6FF00',
      '#AEEA00',
      // Yellow
      '#FFFDE7',
      '#FFF9C4',
      '#FFF59D',
      '#FFF176',
      '#FFEE58',
      '#FFEB3B',
      '#FDD835',
      '#FBC02D',
      '#F9A825',
      '#F57F17',
      '#FFFF8D',
      '#FFFF00',
      '#FFEA00',
      '#FFD600',
      // Amber
      '#FFF8E1',
      '#FFECB3',
      '#FFE082',
      '#FFD54F',
      '#FFCA28',
      '#FFC107',
      '#FFB300',
      '#FFA000',
      '#FF8F00',
      '#FF6F00',
      '#FFE57F',
      '#FFD740',
      '#FFC400',
      '#FFAB00',
      // Orange
      '#FFF3E0',
      '#FFE0B2',
      '#FFCC80',
      '#FFB74D',
      '#FFA726',
      '#FF9800',
      '#FB8C00',
      '#F57C00',
      '#EF6C00',
      '#E65100',
      '#FFD180',
      '#FFAB40',
      '#FF9100',
      '#FF6D00',
      // Deep Orange
      '#FBE9E7',
      '#FFCCBC',
      '#FFAB91',
      '#FF8A65',
      '#FF7043',
      '#FF5722',
      '#F4511E',
      '#E64A19',
      '#D84315',
      '#BF360C',
      '#FF9E80',
      '#FF6E40',
      '#FF3D00',
      '#DD2C00',
      // Brown
      '#EFEBE9',
      '#D7CCC8',
      '#BCAAA4',
      '#A1887F',
      '#8D6E63',
      '#795548',
      '#6D4C41',
      '#5D4037',
      '#4E342E',
      '#3E2723',
      // Grey
      '#FAFAFA',
      '#F5F5F5',
      '#EEEEEE',
      '#E0E0E0',
      '#BDBDBD',
      '#9E9E9E',
      '#757575',
      '#616161',
      '#424242',
      '#212121',
      // Blue Grey
      '#ECEFF1',
      '#CFD8DC',
      '#B0BEC5',
      '#90A4AE',
      '#78909C',
      '#607D8B',
      '#546E7A',
      '#455A64',
      '#37474F',
      '#263238',
      // Basic
      '#FFFFFF',
      '#999999',
      '#000000',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FF00FF',
      '#FFFF00',
      '#00FFFF',
      this.options && this.options.backgroundColorDefault,
    ].filter((x) => x) as string[];
    this.colorsForColorPicker = [];

    const dcpl = DEFAULT_COLORS_FOR_COLORPICKER.length;
    for (var dci = 0; dci < dcpl; ++dci) {
      this.colorsForColorPicker.push(DEFAULT_COLORS_FOR_COLORPICKER[dci]);
    }

    this.usedColorCategories.forEach((e) => {
      var cs = this.obtainPredefinedColors(e);
      var csl = cs.length;
      for (var csi = 0; csi < csl; ++csi) {
        this.colorsForColorPicker!.push(cs[csi]);
      }
    });
  };

  makeColorPicker = (id: d3.Primitive) => {
    if (!OptionsDeclared(this.options)) {
      throw 'Options not set';
    }
    if (!SettingsDeclared(this.settings)) {
      throw 'Settings not set';
    }

    var xPos = 0;
    var yPos = 0;

    if (this.options.visualizationsLegendOrientation === AP.VERTICAL) {
      xPos = this.options.visualizationsLegendXpos + 140;
      yPos = this.options.visualizationsLegendYpos - 10;
    } else {
      xPos = this.options.visualizationsLegendXpos;
      yPos = this.options.visualizationsLegendYpos + 180;
    }

    if (xPos < 20) {
      xPos = 20;
    }
    if (yPos < 20) {
      yPos = 20;
    }

    if (!this.colorsForColorPicker) {
      this.prepareColorsForColorPicker(); // defines colorsForColorPicker
    }

    var fs = this.settings.controlsFontSize.toString() + 'px';

    var clickedOrigColorIndex = -1;

    var lbls = [];
    for (var ii = 0; ii < this.colorsForColorPicker!.length; ++ii) {
      lbls[ii] = ii;
      if (
        clickedOrigColorIndex < 0 &&
        colorToHex(this.colorsForColorPicker![ii]) === colorToHex(this.colorPickerData!.clickedOrigColor)
      ) {
        clickedOrigColorIndex = ii;
      }
    }

    var colorPickerColors = d3.scale.linear<string, string>().domain(lbls).range(this.colorsForColorPicker!);

    var colorPickerSize = 14;
    var rectSize = 10;

    var xCorrectionForLabel = -1;
    var yFactorForDesc = -0.5;

    var colorPicker = this.baseSvg.selectAll('g.' + id).data(colorPickerColors.domain());

    var colorPickerEnter = colorPicker.enter().append('g').attr('class', id);

    colorPickerEnter
      .append('rect')
      .style('cursor', 'pointer')
      .attr('width', (null as unknown) as d3.Primitive)
      .attr('height', (null as unknown) as d3.Primitive)
      .on('click', (d, i) => {
        this.colorPickerClicked(colorPickerColors(d));
      });

    colorPickerEnter
      .append('text')
      .attr('class', AP.COLOR_PICKER_LABEL)
      .style('color', this.settings.controlsFontColor)
      .style('font-size', fs)
      .style(
        'font-family',
        this.settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('font-style', 'normal')
      .style('font-weight', 'bold')
      .style('text-decoration', 'none');

    var colorPickerUpdate = colorPicker.attr('transform', function (d, i) {
      if (i >= 234) {
        i += 4;
        if (i >= 248) {
          i += 4;
        }
        if (i >= 262) {
          i += 4;
        }
        if (i >= 276) {
          i += 4;
        }
        if (i >= 290) {
          i += 4;
        }
        if (i >= 304) {
          i += 4;
        }
        if (i >= 318) {
          i += 4;
        }
        if (i >= 332) {
          i += 4;
        }
        if (i >= 346) {
          i += 4;
        }
      }
      var x = xPos + Math.floor(i / colorPickerSize) * rectSize;
      var y = yPos + (i % colorPickerSize) * rectSize;
      return 'translate(' + x + ',' + y + ')';
    });

    colorPickerUpdate
      .select('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', colorPickerColors)
      .style('stroke', function (d, i) {
        if (i === clickedOrigColorIndex) {
          return AP.COLOR_PICKER_CLICKED_ORIG_COLOR_BORDER_COLOR;
        } else if (i === 263) {
          return AP.COLOR_PICKER_BACKGROUND_BORDER_COLOR;
        }
        return AP.WHITE;
      });

    colorPickerUpdate
      .select('text.' + AP.COLOR_PICKER_LABEL)
      .attr('x', xCorrectionForLabel)
      .attr('y', yFactorForDesc * rectSize)
      .text((d, i) => {
        if (i === 0) {
          return (
            'Choose ' +
            this.colorPickerData!.legendLabel.toLowerCase() +
            ' for ' +
            this.colorPickerData!.legendDescription.toLowerCase() +
            ' "' +
            this.colorPickerData!.clickedName +
            '":'
          );
        }
        return '';
      });

    colorPicker.exit().remove();

    function colorToHex(color: string | CanvasGradient | CanvasPattern) {
      // From http://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
      // Convert any CSS color to a hex representation
      let rgba: Uint8ClampedArray, hex: string;
      rgba = colorToRGBA(color);
      hex = [0, 1, 2]
        .map(function (idx) {
          return byteToHex(rgba[idx]);
        })
        .join('');
      return '#' + hex;

      function colorToRGBA(color: string | CanvasGradient | CanvasPattern) {
        var cvs, ctx;
        cvs = document.createElement('canvas');
        cvs.height = 1;
        cvs.width = 1;
        ctx = cvs.getContext('2d');
        if (!ctx) throw 'No canvas context';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return ctx.getImageData(0, 0, 1, 1).data;
      }

      function byteToHex(num: number) {
        return ('0' + num.toString(16)).slice(-2);
      }
    }
  }; // makeColorPicker

  colorPickerClicked = (colorPicked: string) => {
    if (!this.visualizations || !this.visualizations.labelColor) throw 'Label Colour Visualisations not set';
    if (!this.colorPickerData) throw 'Colour Picker Data not set';
    var vis = this.visualizations.labelColor[this.colorPickerData.legendDescription];
    var mf = vis.mappingFn;

    var scaleType = vis.scaleType;
    if (scaleType === AP.ORDINAL_SCALE) {
      var ord = this.colorPickerData!.targetScale as d3.scale.Ordinal<string, string>;
      let domain = ord.domain();
      var range = ord.range();
      let newColorRange = range.slice();
      for (var di = 0, len = range.length; di < len; ++di) {
        let curName = domain[di];
        if (curName != undefined) {
          if (curName === this.colorPickerData.clickedName) {
            newColorRange[di] = colorPicked;
          } else {
            newColorRange[di] = ord(curName);
          }
        }
      }
      mf.range(newColorRange);
    } else if (scaleType === AP.LINEAR_SCALE) {
      var lin = this.colorPickerData!.targetScale as d3.scale.Linear<number, number>;
      let domain = lin.domain();
      let newColorRange: number[] = [];
      for (var dii = 0, domainLength = domain.length; dii < domainLength; ++dii) {
        let curName = domain[dii];
        if (curName === +this.colorPickerData.clickedName) {
          newColorRange[dii] = +colorPicked;
        } else {
          newColorRange[dii] = lin(curName);
        }
      }
      mf.range(newColorRange);
    }

    this.update();
  };

  // --------------------------------------------------------------

  update = (source_u?: Alcmonavis.phylo, transitionDuration_u?: number, doNotRecalculateWidth?: boolean) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (!SettingsDeclared(this.settings)) throw 'Settings not set';
    const options = this.options,
      settings = this.settings;

    const source: Alcmonavis.phylo = source_u || this.root;
    const transitionDuration: number = transitionDuration_u || AP.TRANSITION_DURATION_DEFAULT;

    if (!doNotRecalculateWidth || !this.w) {
      this.w = this.displayWidth - this.calcMaxTreeLengthForDisplay();
      if (this.w < 1) {
        this.w = 1;
      }
    }

    if (settings.enableNodeVisualizations) {
      this.addLegends();
      if (this.showColorPicker) {
        this.makeColorPicker(AP.COLOR_PICKER);
      }
    }

    this.treeFn = this.treeFn.size([this.displayHeight - 2 * AP.TOP_AND_BOTTOM_BORDER_HEIGHT, this.w]);

    this.treeFn = this.treeFn.separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    });

    this.external_nodes = forester.calcSumOfAllExternalDescendants(this.root);
    var uncollsed_nodes = forester.calcSumOfExternalDescendants(this.root);
    var nodes = this.treeFn.nodes(this.root).reverse();
    var links = this.treeFn.links(nodes);
    var gap = this.options.nodeLabelGap;

    if (options.phylogram === true) {
      this.yScale = this.branchLengthScaling(forester.getAllExternalNodes(this.root), this.w);
    }

    if (options.dynahide) {
      this.dynahide_counter = 0;
      this.dynahide_factor = Math.round(
        +this.options.externalNodeFontSize / ((0.8 * this.displayHeight) / uncollsed_nodes),
      );
      forester.preOrderTraversal(this.root, (n) => {
        if (!n.children && this.dynahide_factor >= 2 && ++this.dynahide_counter % this.dynahide_factor !== 0) {
          n.hide = true;
        } else {
          n.hide = false;
        }
      });
    }

    this.updateDepthCollapseDepthDisplay();
    this.updateBranchLengthCollapseBranchLengthDisplay();
    this.updateButtonEnabledState();
    if (settings.enableNodeVisualizations || settings.enableBranchVisualizations) {
      this.updateLegendButtonEnabledState();
      if (settings.enableMsaResidueVisualizations) {
        this.updateMsaResidueVisCurrResPosLabel();
      }
    }

    var node = this.svgGroup.selectAll('g.node').data(nodes, (d) => {
      return d.id || (d.id = ++this.i + '');
    });

    var nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', () => {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .style('cursor', 'default');

    if (this.treeFn.clickEvent) {
      nodeEnter.on('click', this.treeFn.clickEvent);
    }

    nodeEnter.append('path').attr('d', 'M0,0');

    nodeEnter.append('circle').attr('class', 'nodeCircle').attr('r', 0);

    nodeEnter
      .append('circle')
      .on('mouseover', this.mouseover)
      .on('mousemove', (d) => {
        this.mousemove(d);
      })
      .on('mouseout', this.mouseout)
      .style('cursor', 'pointer')
      .style('opacity', '0')
      .attr('class', 'nodeCircleOptions')
      .attr('r', (d) => {
        if (d.parent) {
          return 5;
        }
        return 0;
      });

    nodeEnter
      .append('text')
      .attr('class', 'extlabel')
      .attr('text-anchor', (d) => {
        return d.children || d._children ? 'end' : 'start';
      })
      .style(
        'font-family',
        options.defaultFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('fill-opacity', 0.5);

    nodeEnter
      .append('text')
      .attr('class', 'bllabel')
      .style(
        'font-family',
        options.defaultFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      )
      .style('fill-opacity', 0.5);

    nodeEnter
      .append('text')
      .attr('class', 'conflabel')
      .attr('text-anchor', 'middle')
      .style(
        'font-family',
        options.defaultFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      );

    nodeEnter.append('text').attr('class', 'brancheventlabel').attr('text-anchor', 'middle');

    nodeEnter
      .append('text')
      .attr('class', 'collapsedText')
      .attr('dy', (d) => {
        return 0.3 * +options.externalNodeFontSize! + 'px';
      })
      .style(
        'font-family',
        options.defaultFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
      );

    node
      .select('text.extlabel')
      .style('font-size', (d) => {
        return d.children || d._children ? options.internalNodeFontSize + 'px' : options.externalNodeFontSize + 'px';
      })
      .style('fill', this.makeLabelColor)
      .attr('dy', (d) => {
        return d.children || d._children
          ? 0.3 * +options.internalNodeFontSize! + 'px'
          : 0.3 * +options.externalNodeFontSize! + 'px';
      })
      .attr('x', (d) => {
        if (!(d.children || d._children)) {
          if (options.phylogram && options.alignPhylogram) {
            return -this.yScale(d.distToRoot) + this.w + gap;
          } else {
            return gap;
          }
        } else {
          return -gap;
        }
      });

    node
      .select('text.bllabel')
      .style('font-size', options.branchDataFontSize + 'px')
      .attr('dy', '-.25em')
      .attr('x', (d) => {
        if (d.parent && d.parent.y) {
          return d.parent.y - (d.y || 0) + 1;
        } else {
          return 0;
        }
      });

    node
      .select('text.conflabel')
      .style('font-size', options.branchDataFontSize + 'px')
      .attr('dy', options.branchDataFontSize)
      .attr('x', (d) => {
        if (d.parent && d.parent.y) {
          return 0.5 * (d.parent.y - (d.y || 0));
        } else {
          return 0;
        }
      });

    node
      .select('text.brancheventlabel')
      .style('font-size', options.branchDataFontSize + 'px')
      .attr('dy', '-.25em')
      .attr('x', (d) => {
        if (d.parent && d.parent.y) {
          return 0.5 * (d.parent.y - (d.y || 0));
        }
        return 0;
      });

    node
      .select('circle.nodeCircle')
      .attr('r', (d) => {
        if (
          options.showNodeVisualizations &&
          !options.showNodeEvents &&
          this.makeNodeStrokeColor(d) === options.backgroundColorDefault &&
          this.makeNodeFillColor(d) === options.backgroundColorDefault
        ) {
          return 0;
        }
        return this.makeNodeSize(d) || 0;
      })
      .style('stroke', (d) => {
        return this.makeNodeStrokeColor(d);
      })
      .style('stroke-width', this.options.branchWidthDefault)
      .style('fill', (d) => {
        return options.showNodeVisualizations || options.showNodeEvents || this.isNodeFound(d)
          ? this.makeNodeFillColor(d)
          : options.backgroundColorDefault!;
      });

    const start = options.phylogram ? -1 : -10;
    const ylength = this.displayHeight / (3 * uncollsed_nodes);

    const nodeUpdate = node
      .transition()
      .duration(transitionDuration)
      .attr('transform', (d) => {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    nodeUpdate.select('text').style('fill-opacity', 1);

    nodeUpdate.select('text.extlabel').text((d) => {
      if (!options.dynahide || !d.hide) {
        return this.makeNodeLabel(d) || '';
      }
      return '';
    });

    nodeUpdate
      .select('text.bllabel')
      .text(options.showBranchLengthValues ? this.makeBranchLengthLabel : () => (null as unknown) as d3.Primitive);

    nodeUpdate
      .select('text.conflabel')
      .text(options.showConfidenceValues ? this.makeConfidenceValuesLabel : () => (null as unknown) as d3.Primitive);

    nodeUpdate
      .select('text.brancheventlabel')
      .text(options.showBranchEvents ? this.makeBranchEventsLabel : () => (null as unknown) as d3.Primitive);

    nodeUpdate
      .select('path')
      .style(
        'stroke',
        options.showNodeVisualizations ? this.makeVisNodeBorderColor : () => (null as unknown) as d3.Primitive,
      )
      .style('stroke-width', options.branchWidthDefault)
      .style(
        'fill',
        options.showNodeVisualizations ? this.makeVisNodeFillColor : () => (null as unknown) as d3.Primitive,
      )
      .style('opacity', options.nodeVisualizationsOpacity)
      .attr('d', options.showNodeVisualizations ? this.makeNodeVisShape : () => (null as unknown) as d3.Primitive);

    node.each(
      ((self: alcmonavispoeschli) => {
        const _: (this: HTMLElement, d: Alcmonavis.phylo) => void = function (d) {
          if (d._children) {
            var yl = ylength;
            var descs = forester.getAllExternalNodes(d);
            if (descs.length < 5) {
              yl = 0.5 * yl;
            }
            var avg = forester.calcAverageTreeHeight(d, descs);

            var xlength = self.options && self.options.phylogram ? self.yScale(avg) : 0;
            d.avg = xlength;
            var l = d.width ? +d.width / 2 : ((self.options && self.options.branchWidthDefault) || 0) / 2;
            var collapsedColor = self.makeCollapsedColor(d);
            d3.select(this)
              .select('path')
              .transition()
              .duration(transitionDuration || 0)
              .attr('d', function () {
                return (
                  'M' +
                  start +
                  ',' +
                  -l +
                  'L' +
                  xlength +
                  ',' +
                  -yl +
                  'L' +
                  xlength +
                  ',' +
                  yl +
                  'L' +
                  start +
                  ',' +
                  l +
                  'L' +
                  start +
                  ',' +
                  -l
                );
              })
              .style('stroke', collapsedColor || AP.WHITE)
              .style('fill', collapsedColor || AP.WHITE);

            d3.select(this)
              .select('.collapsedText')
              .attr('font-size', function (_d) {
                return options.externalNodeFontSize + 'px';
              });

            d3.select(this)
              .select('.collapsedText')
              .transition()
              .duration(transitionDuration || 0)
              .style('fill-opacity', 1)
              .text(self.makeCollapsedLabel(d, descs) || '')
              .style('fill', (d) => {
                return self.makeLabelColorForCollapsed(d, collapsedColor);
              })
              .attr('dy', (d) => {
                return 0.3 * +options.externalNodeFontSize + 'px';
              })
              .attr('x', (d) => {
                if (options.phylogram && options.alignPhylogram) {
                  var w = d;
                  while (w.children && w.children.length > 0) {
                    w = w.children[0];
                  }
                  return -self.yScale(w.distToRoot) + self.w + gap;
                } else {
                  return xlength + gap;
                }
              });
          }
          if (d.children) {
            if (!options.showNodeVisualizations && self.makeNodeVisShape(d) === null) {
              d3.select(this)
                .select('path')
                .transition()
                .duration(transitionDuration || 0)
                .attr('d', function () {
                  return 'M0,0';
                });
            }
            d3.select(this)
              .select('.collapsedText')
              .transition()
              .duration(transitionDuration || 0)
              .attr('x', 0)
              .style('fill-opacity', 1e-6)
              .each(
                'end',
                (() => {
                  const _: (this: HTMLElement) => void = function () {
                    d3.select(this).text('');
                  };
                  return _;
                })(),
              );
          }
        };
        return _;
      })(this),
    );

    const nodeExit = node
      .exit()
      .transition()
      .duration(transitionDuration)
      .attr('transform', function () {
        return 'translate(' + (source && source.y) || 0 + ',' + (source && source.x) || 0 + ')';
      })
      .remove();

    nodeExit.select('circle').attr('r', 0);

    nodeExit.select('text').style('fill-opacity', 0);

    const link = this.svgGroup
      .selectAll('path.link')
      .attr('d', this.elbow)
      .attr('stroke-width', this.makeBranchWidth)
      .data(links, function (d) {
        return d.target.id!;
      });

    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke-width', this.makeBranchWidth)
      .attr('stroke', this.makeBranchColor)
      .attr('d', () => {
        var o = {
          x: source.x0,
          y: source.y0,
        } as Alcmonavis.phylo;
        return this.elbow({
          source: o,
          target: o,
        });
      });

    link.transition().duration(transitionDuration).attr('stroke', this.makeBranchColor).attr('d', this.elbow);

    link
      .exit()
      .attr('d', () => {
        var o = {
          x: source.x,
          y: source.y,
        } as Alcmonavis.phylo;
        return this.elbow({
          source: o,
          target: o,
        });
      })
      .remove();

    if (
      this.options.phylogram &&
      this.options.alignPhylogram &&
      this.options.showExternalLabels &&
      (this.options.showNodeName || this.options.showTaxonomy || this.options.showSequence)
    ) {
      var linkExtension = this.svgGroup
        .append('g')
        .selectAll('path')
        .data(
          links.filter(function (d) {
            return !d.target.children && !(options.dynahide && d.target.hide);
          }),
        );

      linkExtension
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('stroke', this.options.branchColorDefault)
        .style('stroke-opacity', 0.25)
        .attr('d', (d) => {
          return this.connection(d.target) || '';
        });
    }

    for (var i = 0, len = nodes.length; i !== len; ++i) {
      var d = nodes[i];
      d.x0 = d.x || 0;
      d.y0 = d.y || 0;
    }
  };

  makeNodeSize = (node: Alcmonavis.phylo) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (
      (this.options.showNodeEvents &&
        node.events &&
        node.children &&
        (node.events.duplications || node.events.speciations)) ||
      this.isNodeFound(node)
    ) {
      return this.options.nodeSizeDefault;
    }

    return (this.options.nodeSizeDefault > 0 &&
      node.parent &&
      !(this.options.showNodeVisualizations && node.hasVis) &&
      ((node.children && this.options.showInternalNodes) ||
        (!node._children && !node.children && this.options.showExternalNodes))) ||
      (this.options.phylogram && node.parent && !node.parent.parent && (!node.branch_length || node.branch_length <= 0))
      ? this.makeVisNodeSize(node, 0.05)
      : 0;
  };

  makeBranchWidth = (link: d3.layout.cluster.Link<Alcmonavis.phylo>) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (link.target.width) {
      return link.target.width;
    }
    return this.options.branchWidthDefault;
  };

  makeBranchColor = (link: d3.layout.cluster.Link<Alcmonavis.phylo>) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    //if (!this.visualizations || !this.visualizations.nodeFillColor) throw 'Node Fill Colour Visualisation not set';

    //const options = this.options;

    const n = link.target;
    if (this.options.showBranchVisualizations && n != null) {
      if (
        (this.currentLabelColorVisualization === AP.MSA_RESIDUE ||
          this.currentNodeBorderColorVisualization === AP.MSA_RESIDUE ||
          this.currentNodeFillColorVisualization === AP.MSA_RESIDUE) &&
        this.isCanDoMsaResidueVisualizations()
      ) {
        var exts = forester.getAllExternalNodes(n);
        var residue = null;
        for (var i = 0, l = exts.length; i < l; ++i) {
          var ext = exts[i];
          if (ext.sequences && ext.sequences.length > 0) {
            var s = ext.sequences[0];
            if (s.mol_seq && s.mol_seq.value && s.mol_seq.value.length > this.msa_residue_vis_curr_res_pos) {
              var res = s.mol_seq.value.charAt(this.msa_residue_vis_curr_res_pos).toUpperCase();

              if (residue != null) {
                if (residue != res) {
                  residue = null;
                  break;
                }
              } else {
                residue = res;
              }
            }
          }
        }
        if (
          residue != null &&
          residue != '-' &&
          residue != '.' &&
          residue != '?' &&
          this.visualizations &&
          this.visualizations.nodeFillColor
        ) {
          let vis = this.visualizations.nodeFillColor[AP.MSA_RESIDUE];
          return vis.mappingFn ? scaleSwitch(vis.mappingFn)(residue) : vis.mapping[residue];
        }
      } else if (
        (this.isAddVisualization2() || this.isAddVisualization3()) &&
        this.specialVisualizations != null &&
        n.properties != null
      ) {
        //~~
        const l = n.properties.length;
        for (var p = 0; p < l; ++p) {
          if (
            n.properties[p].ref === this.visualizations3_applies_to_ref &&
            n.properties[p].datatype === this.visualizations3_property_datatype &&
            n.properties[p].applies_to === this.visualizations3_property_applies_to
          ) {
            if (
              this.currentNodeFillColorVisualization === n.properties[p].value ||
              this.currentLabelColorVisualization === n.properties[p].value ||
              this.currentNodeBorderColorVisualization === n.properties[p].value
            ) {
              return this.visualizations3_color;
            }
          } else if (
            n.properties[p].ref === this.visualizations2_applies_to_ref &&
            n.properties[p].datatype === this.visualizations2_property_datatype &&
            n.properties[p].applies_to === this.visualizations2_property_applies_to
          ) {
            if (
              this.currentNodeFillColorVisualization === n.properties[p].value ||
              this.currentLabelColorVisualization === n.properties[p].value ||
              this.currentNodeBorderColorVisualization === n.properties[p].value
            ) {
              return this.visualizations2_color;
            }
          } else if (
            n.properties[p].ref === 'vipr:PANGO_Lineage' &&
            n.properties[p].datatype === 'xsd:string' &&
            n.properties[p].applies_to === 'node' &&
            this.visualizations
          ) {
            let vis: Alcmonavis.Visualisation | null | undefined = null;
            if (
              this.visualizations.nodeFillColor &&
              this.currentNodeFillColorVisualization &&
              this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization]
            ) {
              vis = this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization];
            } else if (
              this.visualizations.nodeFillColor &&
              this.currentLabelColorVisualization &&
              this.visualizations.nodeFillColor[this.currentLabelColorVisualization]
            ) {
              vis = this.visualizations.nodeFillColor[this.currentLabelColorVisualization];
            }
            if (vis != null) {
              const color = this.makeVisColor(n, vis);
              if (color) {
                return color;
              }
            }
          }
        }
      }
    }
    if (!this.options.showBranchVisualizations && this.options.showBranchColors && link.target.color) {
      var c = link.target.color;
      return 'rgb(' + c.red + ',' + c.green + ',' + c.blue + ')';
    }
    return this.options.branchColorDefault;
  };

  makeNodeEventsDependentColor = (ev: Forester.PhyloEvents) => {
    if (ev.duplications && ev.duplications > 0 && (!ev.speciations || ev.speciations <= 0)) {
      return AP.DUPLICATION_COLOR;
    } else if (ev.speciations && ev.speciations > 0 && (!ev.duplications || ev.duplications <= 0)) {
      return AP.SPECIATION_COLOR;
    } else if (ev.duplications && ev.speciations && ev.speciations > 0 && ev.duplications > 0) {
      return AP.DUPLICATION_AND_SPECIATION_COLOR_COLOR;
    }
    return null;
  };

  makeNodeFillColor = (phynode: Alcmonavis.phylo): string => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    var foundColor = this.getFoundColor(phynode);
    if (foundColor !== null) {
      return foundColor;
    }
    if (
      this.options.showNodeEvents &&
      phynode.events &&
      phynode.children &&
      (phynode.events.speciations || phynode.events.duplications)
    ) {
      var evColor = this.makeNodeEventsDependentColor(phynode.events);
      if (evColor !== null) {
        return evColor;
      } else {
        return this.options.backgroundColorDefault;
      }
    }
    return this.makeVisNodeFillColor(phynode);
  };

  makeNodeStrokeColor = (phynode: Alcmonavis.phylo): string => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    var foundColor = this.getFoundColor(phynode);
    if (foundColor !== null) {
      return foundColor;
    }
    if (this.options.showNodeEvents && phynode.events && phynode.children) {
      var evColor = this.makeNodeEventsDependentColor(phynode.events);
      if (evColor !== null) {
        return evColor;
      }
    } else if (this.options.showNodeVisualizations) {
      return this.makeVisNodeBorderColor(phynode);
    } else if (this.options.showBranchColors && phynode.color) {
      var c = phynode.color;
      return 'rgb(' + c.red + ',' + c.green + ',' + c.blue + ')';
    }
    return this.options.branchColorDefault;
  };

  makeCollapsedColor = (node: Alcmonavis.phylo) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    var c = this.calcCollapsedColorInSubtree(node);
    if (c) {
      return c;
    }
    c = this.makeLabelColorForCollapsed(node);
    if (c) {
      return c;
    }
    if (this.options.showBranchColors && node.color) {
      return 'rgb(' + node.color.red + ',' + node.color.green + ',' + node.color.blue + ')';
    }
    return this.options.branchColorDefault;
  };

  makeLabelColor = (phynode: Alcmonavis.phylo) => {
    var foundColor = this.getFoundColor(phynode);
    if (foundColor !== null) {
      return foundColor;
    }
    if (this.currentLabelColorVisualization) {
      var color = this.makeVisLabelColor(phynode);
      if (color) {
        return color;
      }
    }
    if (this.options && this.options.showBranchColors && phynode.color) {
      var c = phynode.color;
      return 'rgb(' + c.red + ',' + c.green + ',' + c.blue + ')';
    }
    return (this.options && this.options.labelColorDefault) || AP.WHITE;
  };

  makeLabelColorForCollapsed = (phynode: Alcmonavis.phylo, color?: string) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (color && color != this.options.branchColorDefault) {
      return color;
    }
    if (this.currentLabelColorVisualization) {
      var ncolor = this.makeVisLabelColorForSubtree(phynode);
      if (ncolor) {
        return ncolor;
      }
    }
    if (this.options.showBranchColors && phynode.color) {
      var c = phynode.color;
      return 'rgb(' + c.red + ',' + c.green + ',' + c.blue + ')';
    }
    return this.options.labelColorDefault;
  };

  makeNodeVisShape = (node: Alcmonavis.phylo) => {
    const produceVis = (vis: Alcmonavis.Visualisation, key: string) => {
      if (vis.mappingFn) {
        if (typeof scaleSwitch(vis.mappingFn)(key) === 'string') {
          return makeShape(node, scaleSwitch(vis.mappingFn)(key) as string);
        }
      } else if (vis.mapping[key]) {
        return makeShape(node, vis.mapping[key]);
      }
      return (undefined as unknown) as string;
    };

    const makeShape = (node: Alcmonavis.phylo, shape: string) => {
      node.hasVis = true;
      return d3.svg.symbol<Alcmonavis.phylo>().type(shape).size(this.makeVisNodeSize(node))(node);
    };
    if (
      this.currentNodeShapeVisualization &&
      this.visualizations &&
      !node._children &&
      this.visualizations.nodeShape &&
      this.visualizations.nodeShape[this.currentNodeShapeVisualization] &&
      !this.isNodeFound(node) &&
      this.options &&
      !(this.options.showNodeEvents && node.events && (node.events.duplications || node.events.speciations))
    ) {
      var vis = this.visualizations.nodeShape[this.currentNodeShapeVisualization];
      if (this.currentNodeShapeVisualization === AP.MSA_RESIDUE) {
        if (this.isCanDoMsaResidueVisualizations()) {
          if (node.sequences && node.sequences.length > 0) {
            var s = node.sequences[0];
            if (s.mol_seq && s.mol_seq.value && s.mol_seq.value.length > this.msa_residue_vis_curr_res_pos) {
              var res = s.mol_seq.value.charAt(this.msa_residue_vis_curr_res_pos).toUpperCase();
              if (vis.mappingFn) {
                vis.mappingFn.domain(
                  this.basicTreeProperties!.molSeqResiduesPerPosition![this.msa_residue_vis_curr_res_pos],
                );
              }
              if (vis.mapping) {
                // BM vis.mapping is a Dictionary, not a scale. What is it doing here?
                //vis.mapping.domain(this.basicTreeProperties.molSeqResiduesPerPosition![this.msa_residue_vis_curr_res_pos]);
              }
              return produceVis(vis, res);
            }
          }
        }
        return (undefined as unknown) as string;
      } else {
        if (vis.field) {
          var fieldValue = node[vis.field];
          if (fieldValue && typeof fieldValue === 'string') {
            if (vis.isRegex) {
              for (var key in vis.mapping) {
                if (vis.mapping.hasOwnProperty(key)) {
                  var re = new RegExp(key);
                  if (re && fieldValue.search(re) > -1) {
                    return produceVis(vis, key);
                  }
                }
              }
            } else {
              return produceVis(vis, fieldValue);
            }
          }
        } else if (vis.cladePropertyRef && node.properties && node.properties.length > 0) {
          var ref_name = vis.cladePropertyRef;
          var propertiesLength = node.properties.length;
          for (var i = 0; i < propertiesLength; ++i) {
            var p = node.properties[i];
            if (p.value && p.ref === ref_name) {
              if (this.settings && this.settings.valuesToIgnoreForNodeVisualization) {
                if (p.ref in this.settings.valuesToIgnoreForNodeVisualization) {
                  var ignoreValues = this.settings.valuesToIgnoreForNodeVisualization[p.ref];
                  var arrayLength = ignoreValues.length;
                  for (var i = 0; i < arrayLength; i++) {
                    if (p.value === ignoreValues[i]) {
                      return (undefined as unknown) as string;
                    }
                  }
                }
              }
              return produceVis(vis, p.value);
            }
          }
        }
      }
    }

    return (undefined as unknown) as string;
  };

  makeVisNodeFillColor = (node: Alcmonavis.phylo) => {
    if (
      this.options &&
      this.options.showNodeVisualizations &&
      !node._children &&
      this.currentNodeFillColorVisualization &&
      this.visualizations &&
      this.visualizations.nodeFillColor
    ) {
      if (this.currentNodeFillColorVisualization === AP.MSA_RESIDUE) {
        return this.makeMsaResidueVisualizationColor(node, this.visualizations.nodeFillColor[AP.MSA_RESIDUE]);
      } else if (this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization]) {
        var vis = this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization];
        var color = this.makeVisColor(node, vis);
        if (color) {
          return color;
        }
      } else if (node.properties != null) {
        //~~
        //~~~~~
        const l = node.properties.length;
        for (var p = 0; p < l; ++p) {
          if (
            node.properties[p].ref === this.visualizations3_applies_to_ref &&
            node.properties[p].datatype === this.visualizations3_property_datatype &&
            node.properties[p].applies_to === this.visualizations3_property_applies_to
          ) {
            if (this.currentNodeFillColorVisualization === node.properties[p].value) {
              return this.visualizations3_color;
            }
          } else if (
            node.properties[p].ref === this.visualizations2_applies_to_ref &&
            node.properties[p].datatype === this.visualizations2_property_datatype &&
            node.properties[p].applies_to === this.visualizations2_property_applies_to
          ) {
            if (this.currentNodeFillColorVisualization === node.properties[p].value) {
              return this.visualizations2_color;
            }
          }
        }
      }
    }
    return this.options!.backgroundColorDefault!;
  };

  makeMsaResidueVisualizationColor = (node: Alcmonavis.phylo, vis: Alcmonavis.Visualisation): string => {
    if (this.isCanDoMsaResidueVisualizations()) {
      if (node.sequences && node.sequences.length > 0) {
        var s = node.sequences[0];
        if (s.mol_seq && s.mol_seq.value && s.mol_seq.value.length > this.msa_residue_vis_curr_res_pos) {
          var res = s.mol_seq.value.charAt(this.msa_residue_vis_curr_res_pos).toUpperCase();
          if (vis.mappingFn) {
            vis.mappingFn.domain(
              this.basicTreeProperties!.molSeqResiduesPerPosition![this.msa_residue_vis_curr_res_pos],
            );
            return scaleSwitch(vis.mappingFn)(res) as string;
          } else if (vis.mapping) {
            //vis.mapping.domain(this.basicTreeProperties.molSeqResiduesPerPosition[this.msa_residue_vis_curr_res_pos]);
            return vis.mapping[res];
          }
        }
      }
    }
    return (undefined as unknown) as string;
  };

  makeVisColor = (node: Forester.phylo, vis: Alcmonavis.Visualisation) => {
    if (vis.field) {
      var fieldValue = node[vis.field];
      if (fieldValue && typeof fieldValue === 'string') {
        if (vis.isRegex) {
          for (var key in vis.mapping) {
            if (vis.mapping.hasOwnProperty(key)) {
              var re = new RegExp(key);
              if (re && fieldValue.search(re) > -1) {
                return produceVis(vis, key);
              }
            }
          }
        } else {
          return produceVis(vis, fieldValue);
        }
      }
    } else if (vis.cladePropertyRef && node.properties && node.properties.length > 0) {
      var ref_name = vis.cladePropertyRef;
      var propertiesLength = node.properties.length;
      for (var i = 0; i < propertiesLength; ++i) {
        var p = node.properties[i];
        if (p.value && p.ref === ref_name) {
          if (this.settings && this.settings.valuesToIgnoreForNodeVisualization) {
            var ignore = this.settings.valuesToIgnoreForNodeVisualization;
            // for (var key in nodeProperties) {
            if (p.ref in ignore) {
              var toIgnores = ignore[p.ref];
              var arrayLength = toIgnores.length;
              for (var i = 0; i < arrayLength; i++) {
                if (p.value === toIgnores[i]) {
                  return null;
                }
              }
            }
          }
          return produceVis(vis, p.value);
        }
      }
    }

    return null;

    function produceVis(vis: Alcmonavis.Visualisation, key: string) {
      return vis.mappingFn ? scaleSwitch(vis.mappingFn)(key) + '' : vis.mapping[key];
    }
  };

  addLegend = (type: string, vis?: Alcmonavis.Visualisation) => {
    if (vis && vis.mappingFn) {
      this.legendColorScales[type] = vis.mappingFn;
    }
  };

  addLegendForShapes = (type: string, vis?: Alcmonavis.Visualisation) => {
    if (vis && vis.mappingFn) {
      this.legendShapeScales[type] = vis.mappingFn;
    }
  };

  addLegendForSizes = (type: string, vis?: Alcmonavis.Visualisation) => {
    if (vis && vis.mappingFn) {
      this.legendSizeScales[type] = vis.mappingFn;
    }
  };

  removeLegend = (type: string) => {
    delete this.legendColorScales[type];
  };

  removeLegendForShapes = (type: string) => {
    delete this.legendShapeScales[type];
  };

  removeLegendForSizes = (type: string) => {
    delete this.legendSizeScales[type];
  };

  makeVisNodeBorderColor = (node: Alcmonavis.phylo) => {
    const c = this.makeVisNodeFillColor(node);
    if (c === this.options!.backgroundColorDefault) {
      return this.options!.branchColorDefault!;
    }
    return c;
  };

  makeVisLabelColor = (node: Alcmonavis.phylo) => {
    if (!this.visualizations || !this.visualizations.labelColor) throw 'Label Colour Visualisations not set';
    if (!OptionsDeclared(this.options)) throw 'Options not set';

    if (this.currentLabelColorVisualization === AP.MSA_RESIDUE && this.visualizations.labelColor) {
      return this.makeMsaResidueVisualizationColor(node, this.visualizations.labelColor[AP.MSA_RESIDUE]);
    }
    if (!node._children && this.currentLabelColorVisualization) {
      if (this.visualizations.labelColor[this.currentLabelColorVisualization]) {
        var vis = this.visualizations.labelColor[this.currentLabelColorVisualization];
        var color = this.makeVisColor(node, vis);

        if (color) {
          return color;
        }
      } else if (node.properties !== undefined && node.properties !== null) {
        //~~
        //~~~~~
        const l = node.properties.length;
        for (var p = 0; p < l; ++p) {
          if (
            node.properties[p].ref === this.visualizations3_applies_to_ref &&
            node.properties[p].datatype === this.visualizations3_property_datatype &&
            node.properties[p].applies_to === this.visualizations3_property_applies_to
          ) {
            if (this.currentLabelColorVisualization === node.properties[p].value) {
              return this.visualizations3_color;
            }
          } else if (
            node.properties[p].ref === this.visualizations2_applies_to_ref &&
            node.properties[p].datatype === this.visualizations2_property_datatype &&
            node.properties[p].applies_to === this.visualizations2_property_applies_to
          ) {
            if (this.currentLabelColorVisualization === node.properties[p].value) {
              return this.visualizations2_color;
            }
          }
        }
      }
    }
    return this.options.labelColorDefault;
  };

  makeVisLabelColorForSubtree = (node: Alcmonavis.phylo) => {
    class InternalColour {
      // Sometimes, TypeScript sucks
      private color: string | null | undefined;
      private success: boolean;
      constructor(s: boolean = true) {
        this.color = null;
        this.success = s;
      }

      setSuccess = (s: boolean) => (this.success = s);
      setColour = (c: string) => c;
      getSuccess = () => this.success;
      getColour = () => this.color;
    }
    const colour = new InternalColour();

    if (
      this.currentLabelColorVisualization &&
      this.visualizations &&
      this.visualizations.labelColor &&
      this.visualizations.labelColor[this.currentLabelColorVisualization]
    ) {
      var vis = this.visualizations.labelColor[this.currentLabelColorVisualization];
      forester.preOrderTraversalAll(node, (n) => {
        if (forester.isHasNodeData(n)) {
          var c = this.makeVisColor(n, vis);
          if (!c) {
            colour.setSuccess(false);
          } else if (colour.getColour() === null) {
            colour.setColour(c);
          } else if (colour.getColour() != c) {
            colour.setSuccess(false);
          }
        }
      });
    }
    if (colour.getSuccess() === false) {
      return null;
    }
    return colour.getColour();
  };

  makeVisNodeSize = (node: Alcmonavis.phylo, correctionFactor?: number) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    const options = this.options;
    const produceVis = (vis: Alcmonavis.Visualisation, key: string, correctionFactor?: number) => {
      const size = vis.mappingFn ? scaleSwitch(vis.mappingFn)(key) : vis.mapping[key]; // BM: MappingFunction returns a number? // BM: what scale ends up getting used here?!
      if (size) {
        if (correctionFactor) {
          return correctionFactor * +size * options.nodeSizeDefault;
        } else {
          return +size * options.nodeSizeDefault;
        }
      }
      return null;
    };

    if (this.options.showNodeVisualizations && this.currentNodeSizeVisualization) {
      if (
        this.visualizations &&
        !node._children &&
        this.visualizations.nodeSize &&
        this.visualizations.nodeSize[this.currentNodeSizeVisualization]
      ) {
        var vis = this.visualizations.nodeSize[this.currentNodeSizeVisualization];
        var size;
        if (vis.field) {
          var fieldValue = node[vis.field];
          if (fieldValue && typeof fieldValue === 'string') {
            if (vis.isRegex) {
              for (var key in vis.mapping) {
                if (vis.mapping.hasOwnProperty(key)) {
                  var re = new RegExp(key);
                  if (re && fieldValue.search(re) > -1) {
                    size = produceVis(vis, key, correctionFactor);
                    if (size) {
                      return size;
                    }
                  }
                }
              }
            } else {
              size = produceVis(vis, fieldValue, correctionFactor);
              if (size) {
                return size;
              }
            }
          }
        } else if (vis.cladePropertyRef && node.properties && node.properties.length > 0) {
          var ref_name = vis.cladePropertyRef;
          var propertiesLength = node.properties.length;
          for (var i = 0; i < propertiesLength; ++i) {
            var p = node.properties[i];
            if (p.ref === ref_name && p.value) {
              size = produceVis(vis, p.value, correctionFactor);
              if (size) {
                return size;
              }
            }
          }
        }
      }
    }
    if (correctionFactor) {
      return this.options.nodeSizeDefault;
    } else {
      return 2 * this.options.nodeSizeDefault * this.options.nodeSizeDefault;
    }
  };

  calcCollapsedColorInSubtree = (node: Alcmonavis.phylo) => {
    var found0 = 0;
    var found1 = 0;
    var found0and1 = 0;
    var total = 0;
    if (this.foundNodes0 && this.foundNodes1) {
      forester.preOrderTraversalAll(node, (n) => {
        if (forester.isHasNodeData(n)) {
          ++total;
          if (this.foundNodes0.has(n) && this.foundNodes1.has(n)) {
            ++found0and1;
          } else if (this.foundNodes0.has(n)) {
            ++found0;
          } else if (this.foundNodes1.has(n)) {
            ++found1;
          }
        }
      });
    }
    this.foundSum = found0and1 + found0 + found1;
    this.totalSearchedWithData = total;

    if (total > 0 && this.foundSum > 0 && OptionsDeclared(this.options)) {
      if (found0and1 > 0 || (found0 > 0 && found1 > 0)) {
        if (found0and1 === total) {
          return this.options.found0and1ColorDefault;
        }
        return d3.scale
          .linear<string>()
          .domain([0, total])
          .range([this.options.branchColorDefault, this.options.found0and1ColorDefault])(this.foundSum);
      } else if (found0 > 0) {
        if (found0 === total) {
          return this.options.found0ColorDefault;
        }
        return d3.scale
          .linear<string>()
          .domain([0, total])
          .range([this.options.branchColorDefault, this.options.found0ColorDefault])(found0);
      } else if (found1 > 0) {
        if (found1 === total) {
          return this.options.found1ColorDefault;
        }
        return d3.scale
          .linear<string>()
          .domain([0, total])
          .range([this.options.branchColorDefault, this.options.found1ColorDefault])(found1);
      }
    }
    return null;
  };

  getFoundColor = (phynode: Alcmonavis.phylo) => {
    if (OptionsDeclared(this.options)) {
      if (!this.options.searchNegateResult) {
        if (this.foundNodes0 && this.foundNodes1 && this.foundNodes0.has(phynode) && this.foundNodes1.has(phynode)) {
          return this.options.found0and1ColorDefault;
        } else if (this.foundNodes0 && this.foundNodes0.has(phynode)) {
          return this.options.found0ColorDefault;
        } else if (this.foundNodes1 && this.foundNodes1.has(phynode)) {
          return this.options.found1ColorDefault;
        }
      } else if (forester.isHasNodeData(phynode)) {
        if (
          this.foundNodes0 &&
          !this.searchBox0Empty &&
          this.foundNodes1 &&
          !this.searchBox1Empty &&
          !this.foundNodes0.has(phynode) &&
          !this.foundNodes1.has(phynode)
        ) {
          return this.options.found0and1ColorDefault;
        } else if (this.foundNodes0 && !this.searchBox0Empty && !this.foundNodes0.has(phynode)) {
          return this.options.found0ColorDefault;
        } else if (this.foundNodes1 && !this.searchBox1Empty && !this.foundNodes1.has(phynode)) {
          return this.options.found1ColorDefault;
        }
      }
    }
    return null;
  };

  isNodeFound = (phynode: Alcmonavis.phylo): boolean => {
    if (OptionsDeclared(this.options) && !this.options.searchNegateResult) {
      if ((this.foundNodes0 && this.foundNodes0.has(phynode)) || (this.foundNodes1 && this.foundNodes1.has(phynode))) {
        return true;
      }
    } else if (forester.isHasNodeData(phynode)) {
      if (
        (this.foundNodes0 && !this.searchBox0Empty && !this.foundNodes0.has(phynode)) ||
        (this.foundNodes1 && !this.searchBox1Empty && !this.foundNodes1.has(phynode))
      ) {
        return true;
      }
    }
    return false;
  };

  makeNodeLabel = (phynode: Alcmonavis.phylo) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';

    if (!this.options.showExternalLabels && !(phynode.children || phynode._children)) {
      return null;
    }
    if (!this.options.showInternalLabels && (phynode.children || phynode._children)) {
      return null;
    }
    if (!phynode.parent) {
      // Do not show root data
      return null;
    }

    var l = '';
    if (this.options.showNodeName && phynode.name) {
      if (this.options.shortenNodeNames && phynode.name.length > AP.SHORTEN_NAME_MAX_LENGTH) {
        l = append(l, shortenName(phynode.name, 8));
      } else {
        l = append(l, phynode.name);
      }
    }
    if (this.options.showTaxonomy && phynode.taxonomies && phynode.taxonomies.length > 0) {
      var t = phynode.taxonomies[0];
      if (this.options.showTaxonomyCode) {
        l = append(l, t.code);
      }
      if (this.options.showTaxonomyScientificName) {
        l = append(l, t.scientific_name);
      }
      if (this.options.showTaxonomyCommonName) {
        l = appendP(l, t.common_name);
      }
      if (this.options.showTaxonomyRank) {
        l = appendP(l, t.rank);
      }
      if (this.options.showTaxonomySynonyms) {
        // BM synonymS or synonym ?
        if (t.synonyms && t.synonyms.length > 0) {
          var syn = t.synonyms;
          for (var i = 0; i < syn.length; ++i) {
            l = appendB(l, syn[i]);
          }
        }
      }
    }
    if (this.options.showSequence && phynode.sequences && phynode.sequences.length > 0) {
      var s = phynode.sequences[0];
      if (this.options.showSequenceSymbol) {
        l = append(l, s.symbol);
      }
      if (this.options.showSequenceName) {
        l = append(l, s.name);
      }
      if (this.options.showSequenceGeneSymbol) {
        l = appendP(l, s.gene_name);
      }
      if (this.options.showSequenceAccession && s.accession && s.accession.value) {
        l = appendP(l, s.accession.value);
      }
    }
    if (this.options.showDistributions && phynode.distributions && phynode.distributions.length > 0) {
      var d = phynode.distributions;
      for (var ii = 0; ii < d.length; ++ii) {
        l = appendB(l, d[ii].desc);
      }
    }
    return l;

    function append(str1: string, str2: string): string {
      if (str2 && str2.length > 0) {
        if (str1.length > 0) {
          str1 += ' ' + str2;
        } else {
          str1 = str2;
        }
      }
      return str1;
    }

    function appendP(str1: string, str2: string): string {
      if (str2 && str2.length > 0) {
        if (str1.length > 0) {
          str1 += ' (' + str2 + ')';
        } else {
          str1 = '(' + str2 + ')';
        }
      }
      return str1;
    }

    function appendB(str1: string, str2: string): string {
      if (str2 && str2.length > 0) {
        if (str1.length > 0) {
          str1 += ' [' + str2 + ']';
        } else {
          str1 = '[' + str2 + ']';
        }
      }
      return str1;
    }

    function shortenName(name: string, n: number): string {
      var nlength = name.length;
      return name.substring(0, n) + '..' + name.substring(nlength - n, nlength);
    }
  };

  makeCollapsedLabel = (node: Alcmonavis.phylo, descs: Alcmonavis.phylo[]) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (node.hide) {
      return;
    }

    var first;
    var last;
    if (descs.length > 1) {
      first = descs[0];
      last = descs[descs.length - 1];
    }
    var text = null;
    if (first && last) {
      var first_label = this.makeNodeLabel(first);
      var last_label = this.makeNodeLabel(last);

      if (first_label && last_label) {
        text =
          first_label.substring(0, this.options.collapsedLabelLength) +
          ' ... ' +
          last_label.substring(0, this.options.collapsedLabelLength) +
          ' [' +
          descs.length +
          ']';
        if (this.foundSum > 0 && this.totalSearchedWithData) {
          text += ' [' + this.foundSum + '/' + this.totalSearchedWithData + ']';
        }
      }

      if (node[AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL]) {
        if (text) {
          text = node[AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL] + ': ' + text;
        } else {
          text = node[AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL];
        }
      }
    }
    return text;
  };

  makeBranchLengthLabel = (phynode: Alcmonavis.phylo): number => {
    if (phynode.branch_length) {
      if (
        this.options &&
        this.options.phylogram &&
        this.options.minBranchLengthValueToShow &&
        phynode.branch_length < this.options.minBranchLengthValueToShow
      ) {
        return (undefined as unknown) as number;
      }
      return +phynode.branch_length.toFixed(AP.BRANCH_LENGTH_DIGITS_DEFAULT);
    }
    return (undefined as unknown) as number;
  };

  makeConfidenceValuesLabel = (phynode: Alcmonavis.phylo): string | number => {
    if (phynode.confidences && phynode.confidences.length > 0) {
      var c = phynode.confidences;
      var cl = c.length;
      if (this.options && this.options.minConfidenceValueToShow) {
        var show = false;
        for (var i = 0; i < cl; ++i) {
          if (c[i].value >= this.options.minConfidenceValueToShow) {
            show = true;
            break;
          }
        }
        if (!show) {
          return (undefined as unknown) as string | number;
        }
      }
      if (cl == 1) {
        if (c[0].value) {
          return +c[0].value.toFixed(AP.CONFIDENCE_VALUE_DIGITS_DEFAULT);
        }
      } else {
        var s = '';
        for (var ii = 0; ii < cl; ++ii) {
          if (c[ii].value) {
            if (ii > 0) {
              s += '/';
            }
            s += +c[ii].value.toFixed(AP.CONFIDENCE_VALUE_DIGITS_DEFAULT);
          }
        }
        return s;
      }
    }
    return (undefined as unknown) as string | number;
  };

  makeBranchEventsLabel = (phynode: Alcmonavis.phylo): string => {
    if (phynode.properties && phynode.properties.length > 0) {
      var l = phynode.properties.length;
      var str = null;
      for (var p = 0; p < l; ++p) {
        if (
          phynode.properties[p].ref === AP.BRANCH_EVENT_REF &&
          phynode.properties[p].datatype === AP.BRANCH_EVENT_DATATYPE &&
          phynode.properties[p].applies_to === AP.BRANCH_EVENT_APPLIES_TO
        ) {
          if (str === null) {
            str = phynode.properties[p].value;
          } else {
            str += ' | ' + phynode.properties[p].value;
          }
        }
      }
      if (str !== null) {
        return str;
      }
    }
    return (undefined as unknown) as string;
  };

  elbow = function (d: d3.layout.cluster.Link<Alcmonavis.phylo>) {
    return 'M' + d.source.y + ',' + d.source.x + 'V' + d.target.x + 'H' + d.target.y;
  };

  connection = (n: Alcmonavis.phylo) => {
    if (this.options && this.options.phylogram) {
      var x1 = (n.y || 0) + 5;
      if (n._children) {
        x1 += n.avg;
      }
      var y = n.x;
      var x = (n.y || 0) - this.yScale(n.distToRoot) + this.w;
      if (x - x1 > 5) {
        return 'M' + x1 + ',' + y + 'L' + x + ',' + y;
      }
    }
  };

  initializeOptions = (options?: Alcmonavis.Options | null | undefined) => {
    this.options = options ? options : ({} as Alcmonavis.Options);

    if (this.basicTreeProperties && this.basicTreeProperties.branchLengths) {
      if (this.options.phylogram === undefined) {
        this.options.phylogram = true;
      }
      if (this.options.alignPhylogram === undefined) {
        this.options.alignPhylogram = false;
      }
    } else {
      this.options.phylogram = false;
      this.options.alignPhylogram = false;
    }
    if (this.options.phylogram === false) {
      this.options.alignPhylogram = false;
    }
    if (this.options.dynahide === undefined) {
      this.options.dynahide = true;
    }
    if (
      this.options.searchAinitialValue &&
      typeof this.options.searchAinitialValue === 'string' /*|| this.options.searchAinitialValue instanceof String*/ &&
      this.options.searchAinitialValue.trim().length > 0
    ) {
      this.options.searchAinitialValue = this.options.searchAinitialValue.trim();
      console.log(AP.MESSAGE + 'Setting initial search value for A to: ' + this.options.searchAinitialValue);
    } else {
      this.options.searchAinitialValue = null;
    }
    if (
      this.options.searchBinitialValue &&
      typeof this.options.searchBinitialValue === 'string' /*|| this.options.searchBinitialValue instanceof String*/ &&
      this.options.searchBinitialValue.trim().length > 0
    ) {
      this.options.searchBinitialValue = this.options.searchBinitialValue.trim();
      console.log(AP.MESSAGE + 'Setting initial search value for B to: ' + this.options.searchBinitialValue);
    } else {
      this.options.searchBinitialValue = null;
    }
    if (this.options.showBranchLengthValues === undefined) {
      this.options.showBranchLengthValues = false;
    }
    if (this.options.showConfidenceValues === undefined) {
      this.options.showConfidenceValues = false;
    }
    if (this.options.showNodeName === undefined) {
      this.options.showNodeName = true;
    }
    if (this.options.shortenNodeNames === undefined) {
      this.options.shortenNodeNames = false;
    }
    if (this.options.showTaxonomy === undefined) {
      this.options.showTaxonomy = false;
    }
    if (this.options.showTaxonomyCode === undefined) {
      this.options.showTaxonomyCode = false;
    }
    if (this.options.showTaxonomyScientificName === undefined) {
      this.options.showTaxonomyScientificName = false;
    }
    if (this.options.showTaxonomyCommonName === undefined) {
      this.options.showTaxonomyCommonName = false;
    }
    if (this.options.showTaxonomyRank === undefined) {
      this.options.showTaxonomyRank = false;
    }
    if (this.options.showTaxonomySynonyms === undefined) {
      this.options.showTaxonomySynonyms = false;
    }
    if (this.options.showSequence === undefined) {
      this.options.showSequence = false;
    }
    if (this.options.showSequenceSymbol === undefined) {
      this.options.showSequenceSymbol = false;
    }
    if (this.options.showSequenceName === undefined) {
      this.options.showSequenceName = false;
    }
    if (this.options.showSequenceGeneSymbol === undefined) {
      this.options.showSequenceGeneSymbol = false;
    }
    if (this.options.showSequenceAccession === undefined) {
      this.options.showSequenceAccession = false;
    }
    if (this.options.showDistributions === undefined) {
      this.options.showDistributions = false;
    }
    if (this.options.showInternalNodes === undefined) {
      this.options.showInternalNodes = false;
    }
    if (this.options.showExternalNodes === undefined) {
      this.options.showExternalNodes = false;
    }
    if (this.options.showInternalLabels === undefined) {
      this.options.showInternalLabels = false;
    }
    if (this.options.showExternalLabels === undefined) {
      this.options.showExternalLabels = true;
    }
    if (!this.options.branchWidthDefault) {
      this.options.branchWidthDefault = AP.BRANCH_WIDTH_DEFAULT;
    }
    if (!this.options.branchColorDefault) {
      this.options.branchColorDefault = AP.BRANCH_COLOR_DEFAULT;
    }
    if (!this.options.labelColorDefault) {
      this.options.labelColorDefault = AP.LABEL_COLOR_DEFAULT;
    }
    if (!this.options.backgroundColorDefault) {
      this.options.backgroundColorDefault = AP.BACKGROUND_COLOR_DEFAULT;
    }
    if (!this.options.backgroundColorForPrintExportDefault) {
      this.options.backgroundColorForPrintExportDefault = AP.BACKGROUND_COLOR_FOR_PRINT_EXPORT_DEFAULT;
    }
    if (!this.options.found0ColorDefault) {
      this.options.found0ColorDefault = AP.FOUND0_COLOR_DEFAULT;
    }
    if (!this.options.found1ColorDefault) {
      this.options.found1ColorDefault = AP.FOUND1_COLOR_DEFAULT;
    }
    if (!this.options.found0and1ColorDefault) {
      this.options.found0and1ColorDefault = AP.FOUND0AND1_COLOR_DEFAULT;
    }
    if (!this.options.defaultFont) {
      this.options.defaultFont = AP.FONT_DEFAULTS;
    }
    if (!this.options.nodeSizeDefault) {
      this.options.nodeSizeDefault = AP.NODE_SIZE_DEFAULT_DEFAULT;
    }
    if (!this.options.externalNodeFontSize) {
      this.options.externalNodeFontSize = AP.EXTERNAL_NODE_FONT_SIZE_DEFAULT;
    }
    if (!this.options.internalNodeFontSize) {
      this.options.internalNodeFontSize = AP.INTERNAL_NODE_FONT_SIZE_DEFAULT;
    }
    if (!this.options.branchDataFontSize) {
      this.options.branchDataFontSize = AP.BRANCH_DATA_FONT_SIZE_DEFAULT;
    }
    if (!this.options.collapsedLabelLength) {
      this.options.collapsedLabelLength = AP.COLLAPSED_LABEL_LENGTH_DEFAULT;
    }
    if (!this.options.nodeLabelGap) {
      this.options.nodeLabelGap = AP.NODE_LABEL_GAP_DEFAULT;
    }
    if (!this.options.minBranchLengthValueToShow) {
      this.options.minBranchLengthValueToShow = null;
    }
    if (this.options.minConfidenceValueToShow === undefined) {
      this.options.minConfidenceValueToShow = null;
    }
    if (this.options.searchIsCaseSensitive === undefined) {
      this.options.searchIsCaseSensitive = false;
    }
    if (this.options.searchIsPartial === undefined) {
      this.options.searchIsPartial = true;
    }
    this.options.searchNegateResult = false;
    if (this.options.searchUsesRegex === undefined) {
      this.options.searchUsesRegex = false;
    }
    if (this.options.searchProperties === undefined) {
      this.options.searchProperties = false;
    }
    if (this.options.alignPhylogram === undefined) {
      this.options.alignPhylogram = false;
    }
    if (this.options.showNodeEvents === undefined) {
      this.options.showNodeEvents = false;
    }
    if (this.options.showBranchEvents === undefined) {
      this.options.showBranchEvents = false;
    }
    if (this.options.showNodeVisualizations === undefined) {
      this.options.showNodeVisualizations = false;
    }
    if (this.options.showBranchVisualizations === undefined) {
      this.options.showBranchVisualizations = false;
    }
    if (this.options.nodeVisualizationsOpacity === undefined) {
      this.options.nodeVisualizationsOpacity = AP.NODE_VISUALIZATIONS_OPACITY_DEFAULT;
    }
    if (this.options.showBranchColors === undefined) {
      this.options.showBranchColors = true;
    }
    if (this.options.decimalsForLinearRangeMeanValue === undefined) {
      this.options.decimalsForLinearRangeMeanValue = AP.DECIMALS_FOR_LINEAR_RANGE_MEAN_VALUE_DEFAULT;
    }
    if (this.options.treeName) {
      this.options.treeName = this.options.treeName.trim().replace(/\W+/g, 'this.');
    } else if (this.treeData && this.treeData.name) {
      this.options.treeName = this.treeData.name.trim().replace(/\W+/g, 'this.');
    } else {
      this.options.treeName = null;
    }
    if (!this.options.nameForNhDownload) {
      if (this.options.treeName) {
        this.options.nameForNhDownload = this.options.treeName + AP.NH_SUFFIX;
      } else {
        this.options.nameForNhDownload = AP.NAME_FOR_NH_DOWNLOAD_DEFAULT;
      }
    }
    if (!this.options.nameForPhyloXmlDownload) {
      if (this.options.treeName) {
        this.options.nameForPhyloXmlDownload = this.options.treeName + AP.XML_SUFFIX;
      } else {
        this.options.nameForPhyloXmlDownload = AP.NAME_FOR_PHYLOXML_DOWNLOAD_DEFAULT;
      }
    }
    if (!this.options.nameForPngDownload) {
      if (this.options.treeName) {
        this.options.nameForPngDownload = this.options.treeName + AP.PNG_SUFFIX;
      } else {
        this.options.nameForPngDownload = AP.NAME_FOR_PNG_DOWNLOAD_DEFAULT;
      }
    }
    if (!this.options.nameForSvgDownload) {
      if (this.options.treeName) {
        this.options.nameForSvgDownload = this.options.treeName + AP.SVG_SUFFIX;
      } else {
        this.options.nameForSvgDownload = AP.NAME_FOR_SVG_DOWNLOAD_DEFAULT;
      }
    }
    if (!this.options.visualizationsLegendXpos) {
      this.options.visualizationsLegendXpos = AP.VISUALIZATIONS_LEGEND_XPOS_DEFAULT;
    }
    if (!this.options.visualizationsLegendYpos) {
      this.options.visualizationsLegendYpos = AP.VISUALIZATIONS_LEGEND_YPOS_DEFAULT;
    }
    this.options.visualizationsLegendXposOrig = this.options.visualizationsLegendXpos;
    this.options.visualizationsLegendYposOrig = this.options.visualizationsLegendYpos;
    if (!this.options.visualizationsLegendOrientation) {
      this.options.visualizationsLegendOrientation = AP.VISUALIZATIONS_LEGEND_ORIENTATION_DEFAULT;
    }

    if (!this.options.initialCollapseFeature) {
      this.options.initialCollapseFeature = null;
    }

    if (!this.options.initialCollapseDepth) {
      this.options.initialCollapseDepth = -1;
    }

    this.options.externalNodeFontSize = parseInt(this.options.externalNodeFontSize as string);
    this.options.internalNodeFontSize = parseInt(this.options.internalNodeFontSize as string);
    this.options.branchDataFontSize = parseInt(this.options.branchDataFontSize as string);
  };

  initializeSettings = (settings: Alcmonavis.Settings) => {
    this.settings = settings ? settings : ({} as Alcmonavis.Settings);

    if (!this.settings.controls1Width) {
      this.settings.controls1Width = AP.CONTROLS_1_WIDTH_DEFAULT;
    }
    if (!this.settings.rootOffset) {
      this.settings.rootOffset = AP.ROOTOFFSET_DEFAULT;
    }

    if (this.settings.enableDynamicSizing === undefined) {
      this.settings.enableDynamicSizing = true;
    }
    if (this.settings.displayWidth && this.settings.enableDynamicSizing === true) {
      console.log(AP.WARNING + ': dynamic sizing is turned on, will ignore displayWidth setting');
      this.settings.displayWidth = 0;
    }
    if (this.settings.displayHeight && this.settings.enableDynamicSizing === true) {
      console.log(AP.WARNING + ': dynamic sizing is turned on, will ignore displayHeight setting');
      this.settings.displayHeight = 0;
    }
    if (!this.settings.displayWidth && !this.settings.enableDynamicSizing) {
      this.settings.displayWidth = AP.DISPLAY_WIDTH_DEFAULT;
    }
    if (!this.settings.displayHeight && !this.settings.enableDynamicSizing) {
      this.settings.displayHeight = AP.DISPLY_HEIGHT_DEFAULT;
    }
    if (!this.settings.controlsFontSize) {
      this.settings.controlsFontSize = AP.CONTROLS_FONT_SIZE_DEFAULT;
    }
    if (!this.settings.controlsFontColor) {
      this.settings.controlsFontColor = AP.CONTROLS_FONT_COLOR_DEFAULT;
    }
    if (!this.settings.controlsFont) {
      this.settings.controlsFont = AP.CONTROLS_FONT_DEFAULTS;
    }
    if (!this.settings.controlsBackgroundColor) {
      this.settings.controlsBackgroundColor = AP.CONTROLS_BACKGROUND_COLOR_DEFAULT;
    }
    if (!this.settings.controls0) {
      this.settings.controls0 = AP.CONTROLS_0;
    }
    if (!this.settings.controls0Left) {
      this.settings.controls0Left = AP.CONTROLS_0_LEFT_DEFAULT;
    }
    if (!this.settings.controls0Top) {
      this.settings.controls0Top = AP.CONTROLS_0_TOP_DEFAULT;
    }
    if (!this.settings.controls1Top) {
      this.settings.controls1Top = AP.CONTROLS_1_TOP_DEFAULT;
    }
    if (!this.settings.controls1) {
      this.settings.controls1 = AP.CONTROLS_1;
    }
    if (this.settings.enableDownloads === undefined) {
      this.settings.enableDownloads = false;
    }
    if (this.settings.enableBranchVisualizations === undefined) {
      this.settings.enableBranchVisualizations = false;
    }
    if (this.settings.enableNodeVisualizations === undefined) {
      this.settings.enableNodeVisualizations = false;
    }
    if (this.settings.enableCollapseByBranchLenghts === undefined) {
      this.settings.enableCollapseByBranchLenghts = false;
    }
    if (this.settings.enableCollapseByTaxonomyRank === undefined) {
      this.settings.enableCollapseByTaxonomyRank = false;
    }
    if (this.settings.enableCollapseByFeature === undefined) {
      this.settings.enableCollapseByFeature = false;
    }

    if (this.settings.nhExportWriteConfidences === undefined) {
      this.settings.nhExportWriteConfidences = false;
    }
    if (this.settings.searchFieldWidth === undefined) {
      this.settings.searchFieldWidth = AP.SEARCH_FIELD_WIDTH_DEFAULT;
    }
    if (this.settings.textFieldHeight === undefined) {
      this.settings.textFieldHeight = AP.TEXT_INPUT_FIELD_DEFAULT_HEIGHT;
    }
    if (this.settings.collapseLabelWidth === undefined) {
      this.settings.collapseLabelWidth = AP.COLLAPSE_LABEL_WIDTH_DEFAULT;
    }
    if (this.settings.showBranchColorsButton === undefined) {
      this.settings.showBranchColorsButton = false;
    }
    if (this.settings.showDynahideButton === undefined) {
      if (this.basicTreeProperties && this.basicTreeProperties.externalNodesCount > 20) {
        this.settings.showDynahideButton = true;
      } else {
        this.settings.showDynahideButton = false;
      }
    }
    if (this.settings.showShortenNodeNamesButton === undefined) {
      if (this.basicTreeProperties && this.basicTreeProperties.longestNodeName > AP.SHORTEN_NAME_MAX_LENGTH) {
        this.settings.showShortenNodeNamesButton = true;
      } else {
        this.settings.showShortenNodeNamesButton = false;
      }
    }
    if (this.settings.nhExportReplaceIllegalChars === undefined) {
      this.settings.nhExportReplaceIllegalChars = true;
    }

    if (this.settings.enableSubtreeDeletion === undefined) {
      this.settings.enableSubtreeDeletion = true;
    }
    if (this.settings.enableAccessToDatabases === undefined) {
      this.settings.enableAccessToDatabases = true;
    }

    if (
      this.settings.enableMsaResidueVisualizations === true &&
      this.basicTreeProperties &&
      this.basicTreeProperties.alignedMolSeqs === true &&
      this.basicTreeProperties.maxMolSeqLength &&
      this.basicTreeProperties.maxMolSeqLength > 1
    ) {
      this.settings.enableMsaResidueVisualizations = true;
    } else {
      this.settings.enableMsaResidueVisualizations === false;
    }
    if (this.settings.zoomToFitUponWindowResize === undefined) {
      this.settings.zoomToFitUponWindowResize = true;
    }
    if (this.settings.dynamicallyAddNodeVisualizations === undefined) {
      this.settings.dynamicallyAddNodeVisualizations = false;
    }
    if (this.settings.propertiesToIgnoreForNodeVisualization === undefined) {
      this.settings.propertiesToIgnoreForNodeVisualization = null;
    }
    if (this.settings.valuesToIgnoreForNodeVisualization === undefined) {
      this.settings.valuesToIgnoreForNodeVisualization = null;
    }
    if (this.settings.groupSpecies === undefined) {
      this.settings.groupSpecies = null;
    }
    if (this.settings.groupYears === undefined) {
      this.settings.groupYears = null;
    }

    this.settings.controlsFontSize = parseInt(this.settings.controlsFontSize as string);

    this.intitializeDisplaySize();

    if (!this.settings.controls1Left) {
      // this needs to be after intitializeDisplaySize()
      this.settings.controls1Left = this.displayWidth - this.settings.controls1Width;
    }
  };

  intitializeDisplaySize = () => {
    //if (!SettingsDeclared(this.settings)) throw 'Settings not set';
    if (this.settings && this.settings.enableDynamicSizing) {
      if (this.baseSvg) {
        this.displayHeight = +this.baseSvg.attr('height');
        this.displayWidth = +this.baseSvg.attr('width');
      } else {
        var element = d3.select(this.id).node() as HTMLElement;
        var width = element.getBoundingClientRect().width - AP.WIDTH_OFFSET;
        var top = element.getBoundingClientRect().top;
        var height = window.innerHeight - (top + AP.HEIGHT_OFFSET);
        this.displayHeight = height;
        this.displayWidth = width;
      }
    } else {
      this.displayHeight = (this.settings && this.settings.displayHeight) || 0;
      this.displayWidth = (this.settings && this.settings.displayWidth) || 0;
    }
  };

  mouseDown = () => {
    const event: MouseEvent = d3.event as MouseEvent;
    if (event.which === 1 && (event.altKey || event.shiftKey)) {
      if (
        this.showLegends &&
        this.settings &&
        (this.settings.enableNodeVisualizations || this.settings.enableBranchVisualizations) &&
        (this.legendColorScales[AP.LEGEND_LABEL_COLOR] ||
          (this.options &&
            this.options.showNodeVisualizations &&
            (this.legendColorScales[AP.LEGEND_NODE_FILL_COLOR] ||
              this.legendColorScales[AP.LEGEND_NODE_BORDER_COLOR] ||
              this.legendShapeScales[AP.LEGEND_NODE_SHAPE] ||
              this.legendSizeScales[AP.LEGEND_NODE_SIZE])))
      ) {
        this.moveLegendWithMouse(event);
      }
    }
  };

  deleteValuesFromNodeProperties = (
    valuesToIgnoreForNodeVisualization: Dict<string>,
    nodeProperties: Dict<Set<string>>,
  ) => {
    for (var key in nodeProperties) {
      if (key in valuesToIgnoreForNodeVisualization) {
        var ignoreValues = valuesToIgnoreForNodeVisualization[key];
        var arrayLength = ignoreValues.length;
        for (var i = 0; i < arrayLength; i++) {
          var ignoreValue = ignoreValues[i];
          var deleted = nodeProperties[key].delete(ignoreValue);
          if (deleted === true) {
            console.log(AP.MESSAGE + 'Ignoring "' + key + '=' + ignoreValue + '" for visualizations');
          }
        }
      }
    }
  };

  groupYears = (
    phy: Alcmonavis.phylo,
    sourceRef: string,
    targetRef: string,
    yearsToIgnore: number[],
    yearsPerGroup: number,
  ) => {
    var minYear = 10000000;
    var maxYear = -10000000;
    forester.preOrderTraversalAll(phy, function (n) {
      if (n.properties && n.properties.length > 0) {
        var propertiesLength = n.properties.length;
        for (var i = 0; i < propertiesLength; ++i) {
          var property = n.properties[i];
          if (
            property.ref &&
            property.value &&
            property.datatype &&
            property.applies_to &&
            property.applies_to === 'node'
          ) {
            if (property.ref === sourceRef) {
              var year = +property.value;
              if (yearsToIgnore.indexOf(year) < 0) {
                if (year > maxYear) {
                  maxYear = year;
                }
                if (year < minYear) {
                  minYear = year;
                }
              }
            }
          }
        }
      }
    });

    var MAX_COLORS = 20;

    var d: number;
    if (maxYear - minYear < yearsPerGroup * MAX_COLORS) {
      d = yearsPerGroup;
    } else {
      d = parseInt((maxYear - minYear) / MAX_COLORS + '');
    }

    console.log(AP.MESSAGE + ' year group range:' + d);

    forester.preOrderTraversalAll(phy, function (n) {
      if (n.properties && n.properties.length > 0) {
        var propertiesLength = n.properties.length;
        for (var i = 0; i < propertiesLength; ++i) {
          var property = n.properties[i];
          if (
            property.ref &&
            property.value &&
            property.datatype &&
            property.applies_to &&
            property.applies_to === 'node'
          ) {
            if (property.ref === sourceRef) {
              var year = +property.value;
              if (yearsToIgnore.indexOf(year) < 0) {
                var x = parseInt((year - minYear) / d + '');
                minYear = parseInt(minYear + '');
                var newProp = {} as Forester.property;
                newProp.ref = targetRef;
                var lb = minYear + x * d;
                var hb = minYear + (x + 1) * d - 1;
                newProp.value = lb + '-' + hb;
                if (year < lb || year > hb) {
                  alert(AP.ERROR + year + ' not in ' + newProp.value);
                }
                newProp.datatype = property.datatype;
                newProp.applies_to = property.applies_to;
                n.properties.push(newProp);
              }
            }
          }
        }
      }
    });
  };

  private launch = (
    id: string,
    phylo: Alcmonavis.phylo | undefined | null,
    options: Alcmonavis.Options | undefined | null,
    settings: Alcmonavis.Settings,
    nodeVisualizations?: Dict<Alcmonavis.NodeVisualisation>,
    specialVisualizations?: Dict<Alcmonavis.SpecialVisulaisation>,
  ) => {
    if (phylo === undefined || phylo === null) {
      console.log(AP.ERROR + 'input tree is undefined or null');
      alert(AP.ERROR + 'input tree is undefined or null');
      return;
    }
    if (!phylo.children || phylo.children.length < 1) {
      console.log(AP.ERROR + 'input tree is empty or illegally formatted');
      alert(AP.ERROR + 'input tree is empty or illegally formatted');
      return;
    }

    this.treeData = phylo;
    this.id = id;
    this.zoomListener = d3.behavior.zoom().scaleExtent([0.1, 10]).on('zoom', this.zoom); //?
    this.basicTreeProperties = forester.collectBasicTreeProperties(this.treeData);

    if (settings.groupSpecies) {
      if (settings.groupSpecies.source && settings.groupSpecies.target) {
        console.log(
          AP.MESSAGE +
            ' Grouping species from "' +
            settings.groupSpecies.source +
            '" to "' +
            settings.groupSpecies.target,
        );
        forester.shortenProperties(
          this.treeData,
          'node',
          true,
          settings.groupSpecies.source,
          settings.groupSpecies.target,
        );
      }
    }

    if (settings.groupYears) {
      if (
        settings.groupYears.source &&
        settings.groupYears.target &&
        settings.groupYears.ignore &&
        settings.groupYears.groupsize
      ) {
        console.log(
          AP.MESSAGE +
            ' Grouping years from "' +
            settings.groupYears.source +
            '" to "' +
            settings.groupYears.target +
            '", ignoring ' +
            settings.groupYears.ignore +
            ', range ' +
            settings.groupYears.groupsize,
        );
        this.groupYears(
          this.treeData,
          settings.groupYears.source,
          settings.groupYears.target,
          settings.groupYears.ignore,
          settings.groupYears.groupsize,
        );
      }
    }
    if (nodeVisualizations) {
      this.nodeVisualizations = nodeVisualizations;
    }

    if (specialVisualizations) {
      this.specialVisualizations = specialVisualizations;
    }

    if (settings.readSimpleCharacteristics) {
      //forester.moveSimpleCharacteristicsToProperties(this.treeData);
    }

    this.initializeOptions(options);
    this.initializeSettings(settings);

    if (settings.specialProcessing && settings.specialProcessing.includes('ird_split_avian_host')) {
      var avianFound = forester.splitProperty(this.treeData, 'Avian', 'ird:Host', 'ird:HostGroup');
      if (!avianFound) {
        delete this.nodeVisualizations.HostGroup;
        console.log(AP.MESSAGE + 'Deactivated Host Group visualization for Avian issue in IRD');
      } else {
        console.log(AP.MESSAGE + 'Activated Host Group visualization for Avian issue in IRD');
      }
    }

    if (settings.enableNodeVisualizations) {
      if (
        settings.enableMsaResidueVisualizations &&
        this.basicTreeProperties.alignedMolSeqs === true &&
        this.basicTreeProperties.maxMolSeqLength &&
        this.basicTreeProperties.maxMolSeqLength > 1
      ) {
        if (this.nodeVisualizations == null) {
          this.nodeVisualizations = {} as Dict<Alcmonavis.NodeVisualisation>;
        }
        this.nodeVisualizations[AP.MSA_RESIDUE] = {
          label: AP.MSA_RESIDUE,
          description: '',
          field: null,
          cladeRef: 'na',
          regex: false,
          shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'circle', 'cross'],
          colors: 'na',
          sizes: null,
        };
      }

      if (this.settings && this.settings.dynamicallyAddNodeVisualizations === true) {
        var refsSet = forester.collectPropertyRefs(this.treeData, 'node', false);
        var re = new RegExp('.*:(.+)'); // For extracting the substring after the ':'

        refsSet.forEach((value: string) => {
          var arr = re.exec(value);
          var propertyName: PropertyKey | null | undefined = arr && arr[1]; // The substring after the ':'

          if (
            propertyName &&
            this.settings &&
            !this.nodeVisualizations.hasOwnProperty(propertyName) &&
            (!this.settings.propertiesToIgnoreForNodeVisualization ||
              this.settings.propertiesToIgnoreForNodeVisualization.indexOf(propertyName) < 0)
          ) {
            this.nodeVisualizations[propertyName] = {
              label: propertyName,
              description: 'the ' + propertyName,
              field: null,
              cladeRef: value,
              regex: false,
              shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
              colors: 'category50',
              sizes: null,
            };
            console.log(AP.MESSAGE + 'Dynamically added property: ' + value + ' as ' + propertyName);
          }
        });
      }

      var nodeProperties = forester.collectProperties(this.treeData, 'node', false);
      if (settings.valuesToIgnoreForNodeVisualization) {
        this.deleteValuesFromNodeProperties(settings.valuesToIgnoreForNodeVisualization, nodeProperties);
      }

      this.initializeNodeVisualizations(nodeProperties);
    }

    this.createGui();

    if (settings.enableNodeVisualizations || settings.enableBranchVisualizations) {
      d3.select(window).on('mousedown', this.mouseDown);
    }

    this.baseSvg = d3
      .select(id)
      .append('svg')
      .attr('width', this.displayWidth)
      .attr('height', this.displayHeight)
      .style('border', () => {
        if (this.settings && this.settings.border) {
          return this.settings.border;
        } else {
          return '';
        }
      })
      .call(this.zoomListener);

    if (this.settings && this.settings.enableDynamicSizing) {
      d3.select(window).on(
        'resize',
        ((self: alcmonavispoeschli) => {
          const _: (this: Window) => void = function () {
            var element = d3.select(this).node(); //this.id //?
            var width = (element as HTMLElement).getBoundingClientRect().width - AP.WIDTH_OFFSET;
            var top = (element as HTMLElement).getBoundingClientRect().top;
            var height = window.innerHeight - (top + AP.HEIGHT_OFFSET);
            self.baseSvg.attr('width', width);
            self.baseSvg.attr('height', height);
            if (
              self.settings &&
              self.settings.zoomToFitUponWindowResize === true &&
              self.zoomed_x_or_y == false &&
              Math.abs(self.zoomListener.scale() - 1.0) < 0.001
            ) {
              self.zoomToFit();
            }
            if (self.settings && (self.settings.enableNodeVisualizations || self.settings.enableBranchVisualizations)) {
              var c1 = $('#' + self.settings.controls1);
              if (c1) {
                c1.css({
                  left: width - (self.settings.controls1Width || 0),
                });
              }
            }
          };

          return _;
        })(this),
      );
    }

    this.treeFn = d3.layout.cluster<Alcmonavis.phylo>().size([this.displayHeight, this.displayWidth]);

    this.treeFn.clickEvent = this.getClickEventListenerNode(phylo);

    this.root = phylo;

    this.calcMaxExtLabel();

    this.root.x0 = this.displayHeight / 2;
    this.root.y0 = 0;

    //this.initializeGui();
    this.makeBackground();

    this.svgGroup = this.baseSvg.append('g');

    if (this.options && this.options.searchAinitialValue) {
      this.search0();
    }
    if (this.options && this.options.searchBinitialValue) {
      this.search1();
    }

    if (this.options && this.options.initialCollapseFeature) {
      var feature = this.options.initialCollapseFeature;
      var refs = forester.collectPropertyRefs(this.root, 'node', false);
      var found = false;
      if (refs) {
        refs.forEach(function (v) {
          if (v == feature) {
            found = true;
          }
        });
      }
      if (found) {
        console.log(AP.MESSAGE + 'Setting initial value for collapse by feature to: ' + feature);
        this.collapseSpecificSubtrees(this.root, feature, AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL);
        var s = $('#' + AP.COLLAPSE_BY_FEATURE_SELECT);
        if (s) {
          s.val(feature);
        }
      } else {
        console.log(AP.WARNING + ' initial value for collapse by feature [' + feature + '] not present');
      }
    } else if (this.options && this.options.initialCollapseDepth && this.options.initialCollapseDepth > 0) {
      this.depth_collapse_level = this.options.initialCollapseDepth;
      var max_depth = forester.calcMaxDepth(this.root);
      if (this.depth_collapse_level >= max_depth) {
        console.log(
          AP.WARNING +
            ' initial value for collapse depth [' +
            this.depth_collapse_level +
            '] is larger than or equal to maximum depth [' +
            max_depth +
            ']',
        );
        this.depth_collapse_level = max_depth - 1;
      }
      console.log(AP.MESSAGE + 'Setting initial value for collapse depth to: ' + this.depth_collapse_level);
      forester.collapseToDepth(this.root, this.depth_collapse_level);
      this.updateDepthCollapseDepthDisplay();
    }

    this.update(undefined, 0);

    this.zoomToFit();
  };

  calcMaxExtLabel = () => {
    this.maxLabelLength = (this.options && this.options.nodeLabelGap) || 0;
    forester.preOrderTraversal(this.root, (d) => {
      if (d._children) {
        this.maxLabelLength = Math.max(
          2 * ((this.options && this.options.collapsedLabelLength) || 0) + 8,
          this.maxLabelLength,
        );
      } else if (!d.children) {
        var l = this.makeNodeLabel(d);
        if (l) {
          this.maxLabelLength = Math.max(l.length, this.maxLabelLength);
        }
      }
    });
  };

  removeTooltips = () => this.svgGroup.selectAll('.tooltipElem').remove();

  setBack = () => {
    this.backTreeRoots.push(this.root);
    this.forwardTreeRoots.length = 0;
    this.TriggerHandler('forwardEnable', false);
    this.TriggerHandler('backwardEnable', true);
  };

  goForward = () => {
    if (this.forwardTreeRoots.length > 0) {
      this.backTreeRoots.push(this.root);
      this.goToSubTree(this.forwardTreeRoots.pop()!, false, false);
      this.TriggerHandler('forwardEnable', this.forwardTreeRoots.length > 0);
      this.TriggerHandler('backwardEnable', true);
    }
  };

  goBackward = () => {
    if (this.backTreeRoots.length > 0) {
      this.forwardTreeRoots.push(this.root);
      this.goToSubTree(this.backTreeRoots.pop()!, false, false);
      this.TriggerHandler('forwardEnable', true);
      this.TriggerHandler('backwardEnable', this.backTreeRoots.length > 0);
    }
  };

  goToRootTree = (history: boolean = true) => {
    if (history) {
      this.setBack();
    }
    this.root = this.treeData;
    this.refresh();
  };

  goToParent = (history: boolean = true) => {
    if (this.currentParentNode) {
      this.goToSubTree(this.currentParentNode, history, false);
    }
  };

  goToSuperTree = (history: boolean = true) => {
    if (history) {
      this.setBack();
    }
    this.root = this.superTreeRoots.pop()!;
    this.refresh();
  };

  goToSubTree = (node: Alcmonavis.phylo, history: boolean = true, pushCurrent: boolean = true) => {
    if (node === this.treeData) {
      this.goToRootTree(history);
    } else {
      if (history) {
        this.setBack();
      }
      if (this.superTreeRoots.slice(-1, 1)[0] === this.root) {
        this.superTreeRoots.pop();
      }
      if (pushCurrent) {
        this.superTreeRoots.push(this.root);
      }
      this.currentParentNode = node.parent;
      const fakeNode = {
        children: [node],
        x: 0,
        x0: 0,
        y: 0,
        y0: 0,
      } as Alcmonavis.phylo;
      this.root = fakeNode;
      if (node._children) {
        // To make sure, new root is uncollapsed.
        node.children = node._children;
        node._children = null;
      }
      this.refresh();
    }
  };

  goToSearch = (searchList: number[] = [0]) => {
    const milli = performance.now();
    const foundNodes: Set<Forester.phylo> = new Set();
    searchList.forEach((list) => {
      switch (list) {
        case 0:
          this.foundNodes0.forEach((f) => foundNodes.add(f));
        case 1:
          this.foundNodes1.forEach((f) => foundNodes.add(f));
      }
    });

    if (foundNodes.size > 0) {
      const subRootNode = forester.getSubtree(Array.from(foundNodes));
      console.log(`Get Subtree took ${performance.now() - milli}ms `);
      this.goToSubTree(subRootNode as Alcmonavis.phylo);
    }
  };

  refresh = () => {
    this.basicTreeProperties = forester.collectBasicTreeProperties(this.root);
    this.updateNodeVisualizationsAndLegends(this.root);
    this.resetDepthCollapseDepthValue();
    this.resetRankCollapseRankValue();
    this.resetBranchLengthCollapseValue();
    this.search0Text(this.searchQueries[0]);
    //this.search0();
    this.search1();
    this.zoomToFit();
    this.TriggerHandler('HasParent', Boolean(this.root.parent && this.root.parent.parent));
    this.TriggerHandler('AtRoot', this.root === this.treeData);
  };

  getClickEventListenerNode = (tree: Alcmonavis.phylo) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (!SettingsDeclared(this.settings)) throw 'Settings not set';
    const options = this.options,
      settings = this.settings;

    const nodeClick = (self: alcmonavispoeschli) => {
      const _: (this: EventTarget) => void = function () {
        if (self.showColorPicker === true) {
          self.removeColorPicker();
          self.update();
        }
        function displayNodeData(n: Alcmonavis.phylo) {
          var title = n.name ? 'Node Data: ' + n.name : 'Node Data';
          var text = '';
          if (n.name) {
            text += 'Name: ' + n.name + '<br>';
          }
          if (n.branch_length) {
            text += 'Distance to Parent: ' + n.branch_length + '<br>';
          }
          text += 'Depth: ' + forester.calcDepth(n) + '<br>';
          var i = 0;
          if (n.confidences) {
            for (i = 0; i < n.confidences.length; ++i) {
              var c = n.confidences[i];
              if (c.type) {
                text += 'Confidence [' + c.type + ']: ' + c.value + '<br>';
              } else {
                text += 'Confidence: ' + c.value + '<br>';
              }
              if (c.stddev) {
                text += '- stdev: ' + c.stddev + '<br>';
              }
            }
          }
          if (n.taxonomies) {
            for (i = 0; i < n.taxonomies.length; ++i) {
              text += 'Taxonomy<br>';
              var t = n.taxonomies[i];
              if (t.id) {
                if (t.id.provider) {
                  text += '- Id [' + t.id.provider + ']: ' + t.id.value + '<br>';
                } else {
                  text += '- Id: ' + t.id.value + '<br>';
                }
              }
              if (t.code) {
                text += '- Code: ' + t.code + '<br>';
              }
              if (t.scientific_name) {
                text += '- Scientific name: ' + t.scientific_name + '<br>';
              }
              if (t.common_name) {
                text += '- Common name: ' + t.common_name + '<br>';
              }
              if (t.rank) {
                text += '- Rank: ' + t.rank + '<br>';
              }
            }
          }
          if (n.sequences) {
            for (i = 0; i < n.sequences.length; ++i) {
              text += 'Sequence<br>';
              var s = n.sequences[i];
              if (s.accession) {
                if (s.accession.source) {
                  text += '- Accession [' + s.accession.source + ']: ' + s.accession.value + '<br>';
                } else {
                  text += '- Accession: ' + s.accession.value + '<br>';
                }
                if (s.accession.comment) {
                  text += '-- comment: ' + s.accession.comment + '<br>';
                }
              }
              if (s.symbol) {
                text += '- Symbol: ' + s.symbol + '<br>';
              }
              if (s.name) {
                text += '- Name: ' + s.name + '<br>';
              }
              if (s.gene_name) {
                text += '- Gene name: ' + s.gene_name + '<br>';
              }
              if (s.location) {
                text += '- Location: ' + s.location + '<br>';
              }
              if (s.type) {
                text += '- Type: ' + s.type + '<br>';
              }
            }
          }
          if (n.distributions) {
            var distributions = n.distributions;
            for (i = 0; i < distributions.length; ++i) {
              text += 'Distribution: ';
              if (distributions[i].desc) {
                text += distributions[i].desc + '<br>';
              }
            }
          }
          if (n.date) {
            text += 'Date: ';
            var date = n.date;
            if (date.desc) {
              text += date.desc + '<br>';
            }
          }
          if (n.events) {
            text += 'Events<br>';
            var ev = n.events;
            if (ev.type && ev.type.length > 0) {
              text += '- Type: ' + ev.type + '<br>';
            }
            if (ev.duplications && ev.duplications > 0) {
              text += '- Duplications: ' + ev.duplications + '<br>';
            }
            if (ev.speciations && ev.speciations > 0) {
              text += '- Speciations: ' + ev.speciations + '<br>';
            }
            if (ev.losses && ev.losses > 0) {
              text += '- Losses: ' + ev.losses + '<br>';
            }
          }
          if (n.properties && n.properties.length > 0) {
            var propertiesLength = n.properties.length;
            for (i = 0; i < propertiesLength; ++i) {
              var property = n.properties[i];
              if (property.ref && property.value) {
                if (property.unit) {
                  text += property.ref + ': ' + property.value + property.unit + '<br>';
                } else {
                  text += property.ref + ': ' + property.value + '<br>';
                }
              }
            }
          }
          if (n.children || n._children) {
            text += 'Number of External Nodes: ' + forester.calcSumOfAllExternalDescendants(n) + '<br>';
          }

          $('#' + AP.NODE_DATA).dialog('destroy');

          $("<div id='" + AP.NODE_DATA + "'>" + text + '</div>').dialog();
          var dialog = $('#' + AP.NODE_DATA);

          var fs = ((self.settings && self.settings.controlsFontSize) || 0 + 4).toString() + 'px';

          $('.ui-dialog').css({
            'text-align': 'left',
            color: (self.settings && self.settings.controlsFontColor) || AP.WHITE,
            'font-size': fs,
            'font-family': ((self.settings && self.settings.controlsFont) || [])
              .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
              .reduce((p, v) => p + ', ' + v),
            'font-style': 'normal',
            'font-weight': 'normal',
            'text-decoration': 'none',
            width: 400,
            height: 400,
            overflow: 'auto',
          });

          $('.ui-dialog-titlebar').css({
            'text-align': 'left',
            color: (self.settings && self.settings.controlsFontColor) || AP.WHITE,
            'font-size': fs,
            'font-family': ((self.settings && self.settings.controlsFont) || [])
              .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
              .reduce((p, v) => p + ', ' + v),
            'font-style': 'normal',
            'font-weight': 'bold',
            'text-decoration': 'none',
          });

          dialog.dialog('option', 'modal', true);
          dialog.dialog('option', 'title', title);

          self.update();
        }

        function listExternalNodeData(node: Alcmonavis.phylo) {
          var addSep = function (t: string) {
            if (t.length > 0) {
              t += ', ';
            }
            return t;
          };
          var text_all = '';

          var ext_nodes = forester.getAllExternalNodes(node).reverse();

          var title = 'External Node Data for ' + ext_nodes.length + ' Nodes';

          for (var j = 0, l = ext_nodes.length; j < l; ++j) {
            var text = '';
            var n = ext_nodes[j];
            if (self.options && self.options.showNodeName && n.name) {
              text += n.name;
            }
            if (options.showTaxonomy && n.taxonomies) {
              for (var i = 0; i < n.taxonomies.length; ++i) {
                var t = n.taxonomies[i];
                if (t.id) {
                  if (t.id.provider) {
                    text = addSep(text);
                    text += '[' + t.id.provider + ']:' + t.id.value;
                  } else {
                    text = addSep(text);
                    text += t.id.value;
                  }
                }
                if (options.showTaxonomyCode && t.code) {
                  text = addSep(text);
                  text += t.code;
                }
                if (options.showTaxonomyScientificName && t.scientific_name) {
                  text = addSep(text);
                  text += t.scientific_name;
                }
                if (options.showTaxonomyCommonName && t.common_name) {
                  text = addSep(text);
                  text += t.common_name;
                }
                if (options.showTaxonomyRank && t.rank) {
                  text = addSep(text);
                  text += t.rank;
                }
              }
            }
            if (options.showSequence && n.sequences) {
              for (i = 0; i < n.sequences.length; ++i) {
                var s = n.sequences[i];
                if (options.showSequenceAccession && s.accession) {
                  if (s.accession.source) {
                    text = addSep(text);
                    text += '[' + s.accession.source + ']:' + s.accession.value;
                  } else {
                    text = addSep(text);
                    text += s.accession.value;
                  }
                }
                if (options.showSequenceSymbol && s.symbol) {
                  text = addSep(text);
                  text += s.symbol;
                }
                if (options.showSequenceName && s.name) {
                  text = addSep(text);
                  text += s.name;
                }
                if (s.gene_name) {
                  text = addSep(text);
                  text += s.gene_name;
                }
                if (s.location) {
                  text = addSep(text);
                  text += s.location;
                }
              }
            }
            if (text.length > 0) {
              text_all += text + '<br>';
            }
          }

          $('#' + AP.NODE_DATA).dialog('destroy');

          $("<div id='" + AP.NODE_DATA + "'>" + text_all + '</div>').dialog();
          var dialog = $('#' + AP.NODE_DATA);

          var fs = (+settings.controlsFontSize + 2).toString() + 'px';

          $('.ui-dialog').css({
            'text-align': 'left',
            color: settings.controlsFontColor,
            'font-size': fs,
            'font-family': AP.MOLSEQ_FONT_DEFAULTS.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce(
              (p, v) => p + ', ' + v,
            ),
            'font-style': 'normal',
            'font-weight': 'normal',
            'text-decoration': 'none',
            width: 740,
            height: 400,
            overflow: 'auto',
          });

          $('.ui-dialog-titlebar').css({
            'text-align': 'left',
            color: settings.controlsFontColor,
            'font-size': fs,
            'font-family': settings.controlsFont
              .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
              .reduce((p, v) => p + ', ' + v),
            'font-style': 'normal',
            'font-weight': 'bold',
            'text-decoration': 'none',
          });

          dialog.dialog('option', 'modal', true);
          dialog.dialog('option', 'title', title);

          self.update();
        }

        // BM ??
        function accessDatabase(node: Alcmonavis.phylo) {
          var url = null;
          let value: string = 'undefined';
          if (node.sequences) {
            for (var i = 0; i < node.sequences.length; ++i) {
              var s = node.sequences[i];
              if (s.accession && s.accession.value && s.accession.source) {
                value = s.accession.value;
                var source = s.accession.source.toUpperCase();

                if (source === AP.ACC_GENBANK) {
                  if (AP.RE_GENBANK_PROT.test(value)) {
                    url = 'https://www.ncbi.nlm.nih.gov/protein/' + value;
                  } else if (AP.RE_GENBANK_NUC.test(value)) {
                    url = 'https://www.ncbi.nlm.nih.gov/nuccore/' + value;
                  }
                } else if (source === AP.ACC_REFSEQ) {
                  url = 'https://www.ncbi.nlm.nih.gov/nuccore/' + value;
                } else if (source === AP.ACC_UNIPROT || source === AP.ACC_UNIPROTKB) {
                  url = 'https://www.uniprot.org/uniprot/' + value;
                } else if (source === AP.ACC_SWISSPROT || source === AP.ACC_TREMBL) {
                  url = 'https://www.uniprot.org/uniprot/' + value;
                } else if (source === 'UNKNOWN' || source === '?') {
                  if (AP.RE_GENBANK_PROT.test(value)) {
                    url = 'https://www.ncbi.nlm.nih.gov/protein/' + value;
                  } else if (AP.RE_GENBANK_NUC.test(value)) {
                    url = 'https://www.ncbi.nlm.nih.gov/nuccore/' + value;
                  } else if (AP.RE_REFSEQ.test(value)) {
                    url = 'https://www.ncbi.nlm.nih.gov/nuccore/' + value;
                  } else if (AP.RE_UNIPROTKB.test(value)) {
                    url = 'https://www.uniprot.org/uniprot/' + value;
                  } else if (AP.RE_SWISSPROT_TREMBL.test(value)) {
                    url = 'https://www.uniprot.org/uniprot/' + value;
                  } else if (AP.RE_SWISSPROT_TREMBL_PFAM.test(value)) {
                    url = 'https://www.uniprot.org/uniprot/' + AP.RE_SWISSPROT_TREMBL_PFAM.exec(value)![1];
                  }
                }
              }
            }
          }
          if (node.name) {
            if (AP.RE_SWISSPROT_TREMBL.test(node.name)) {
              url = 'https://www.uniprot.org/uniprot/' + node.name;
            } else if (AP.RE_SWISSPROT_TREMBL_PFAM.test(node.name)) {
              url = 'https://www.uniprot.org/uniprot/' + AP.RE_SWISSPROT_TREMBL_PFAM.exec(node.name)![1];
            }
          }

          if (url) {
            var win = window.open(url, 'this.blank');
            if (win) {
              win.focus();
            }
          } else {
            alert("Don't know how to interpret sequence accession '" + value + "'");
          }
        }

        function listMolecularSequences(node: Alcmonavis.phylo) {
          var text_all = '';

          var ext_nodes = forester.getAllExternalNodes(node).reverse();
          var title = 'Sequences in Fasta-format for ' + ext_nodes.length + ' Nodes';

          for (var j = 0, l = ext_nodes.length; j < l; ++j) {
            var n = ext_nodes[j];
            if (n.sequences) {
              for (var i = 0; i < n.sequences.length; ++i) {
                var s = n.sequences[i];
                if (s.mol_seq && s.mol_seq.value && s.mol_seq.value.length > 0) {
                  var seq = s.mol_seq.value;
                  var seqname = j + ''; // num as string
                  if (s.name && s.name.length > 0) {
                    seqname = s.name;
                  } else if (n.name && n.name.length > 0) {
                    seqname = n.name;
                  }

                  var split_seq_ary = seq.match(/.{1,80}/g) || [];
                  var split_seq = '';
                  for (var ii = 0; ii < split_seq_ary.length; ++ii) {
                    split_seq += split_seq_ary[ii] + '<br>';
                  }

                  var fasta = '>' + seqname + '<br>' + split_seq;
                  text_all += fasta;
                }
              }
            }
          }

          $('#' + AP.NODE_DATA).dialog('destroy');

          $("<div id='" + AP.NODE_DATA + "'>" + text_all + '</div>').dialog();
          var dialog = $('#' + AP.NODE_DATA);

          var fs = (+settings.controlsFontSize + 2).toString() + 'px';

          $('.ui-dialog').css({
            'text-align': 'left',
            color: settings.controlsFontColor,
            'font-size': fs,
            'font-family': AP.MOLSEQ_FONT_DEFAULTS.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce(
              (p, v) => p + ', ' + v,
            ),
            'font-style': 'normal',
            'font-weight': 'normal',
            'text-decoration': 'none',
            width: 700,
            height: 400,
            overflow: 'auto',
          });

          $('.ui-dialog-titlebar').css({
            'text-align': 'left',
            color: settings.controlsFontColor,
            'font-size': fs,
            'font-family': settings.controlsFont
              .map((v) => (/\s/.test(v) ? '"' + v + '"' : v))
              .reduce((p, v) => p + ', ' + v),
            'font-style': 'normal',
            'font-weight': 'bold',
            'text-decoration': 'none',
          });

          dialog.dialog('option', 'modal', true);
          dialog.dialog('option', 'title', title);

          self.update();
        }

        function swapChildren(d: Alcmonavis.phylo) {
          var c = d.children;
          var l = (c && c.length) || 0;
          if (l > 1) {
            var first = c![0];
            for (var i = 0; i < l - 1; ++i) {
              c![i] = c![i + 1];
            }
            c![l - 1] = first;
          }
        }

        function toggleCollapse(node: Alcmonavis.phylo) {
          if (node.children) {
            node._children = node.children;
            node.children = undefined;
          } else {
            self.unCollapseAll(node);
          }
        }

        var rectWidth = 130;
        var rectHeight = 230;

        self.removeTooltips();

        d3.select(this)
          .append('rect')
          .attr('class', 'tooltipElem')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .attr('rx', 10)
          .attr('ry', 10)
          .style('fill-opacity', 0.9)
          .style('fill', AP.NODE_TOOLTIP_BACKGROUND_COLOR);

        var rightPad = 10;
        var topPad = 20;
        var textSum = 0;
        var textInc = 20;

        var fs = settings.controlsFontSize.toString() + 'px';

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style('font-family', 'Helvetica')
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d) {
            if (d.parent) {
              textSum += textInc;
              return 'Display Node Data';
            }
            return '';
          })
          .on('click', function (d) {
            displayNodeData(d);
          });

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d) {
            if (d.parent && d.parent.parent) {
              if (d._children) {
                textSum += textInc;
                return 'Uncollapse';
              } else if (d.children) {
                textSum += textInc;
                return 'Collapse';
              }
            }
            return '';
          })
          .on('click', function (d) {
            toggleCollapse(d);
            self.resetDepthCollapseDepthValue();
            self.resetRankCollapseRankValue();
            self.resetBranchLengthCollapseValue();
            self.resetCollapseByFeature();
            self.update(d);
          });

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d) {
            var cc = 0;
            forester.preOrderTraversalAll(d, function (e) {
              if (e._children) {
                ++cc;
              }
            });
            if (cc > 1 || (cc == 1 && !d._children)) {
              textSum += textInc;
              return 'Uncollapse All';
            }
            return '';
          })
          .on('click', function (d) {
            self.unCollapseAll(d);
            self.resetDepthCollapseDepthValue();
            self.resetRankCollapseRankValue();
            self.resetBranchLengthCollapseValue();
            self.resetCollapseByFeature();
            self.update();
          });

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text((d: Alcmonavis.phylo) => {
            if (d.parent && (d.children || d._children) && d.parent.parent) {
              textSum += textInc;
              return 'Go to Subtree';
            }
            return '';
          })
          .on('click', (d: Alcmonavis.phylo) => self.goToSubTree(d));

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text((d: Alcmonavis.phylo) => {
            if (
              d.parent &&
              (d.children || d._children) &&
              self.superTreeRoots.length > 0 &&
              self.root.children &&
              d === self.root.children[0]
            ) {
              textSum += textInc;
              return 'Return to Supertree';
            }
            return '';
          })
          .on('click', self.goToSuperTree);

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text((d: Alcmonavis.phylo) => {
            if (
              d.parent &&
              (d.children || d._children) &&
              self.superTreeRoots.length > 0 &&
              self.root.children &&
              d === self.root.children[0]
            ) {
              textSum += textInc;
              return 'Go to Parent Subtree';
            }
            return '';
          })
          .on('click', self.goToParent);

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d) {
            if (d.parent) {
              if (d.children) {
                textSum += textInc;
                return 'Swap Descendants';
              }
            }
            return '';
          })
          .on('click', (d) => {
            swapChildren(d);
            self.update();
          });

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d: Alcmonavis.phylo) {
            if (d.parent) {
              if (d.children) {
                textSum += textInc;
                return 'Order Subtree';
              }
            }
            return '';
          })
          .on('click', (d: Alcmonavis.phylo) => {
            if (!self.treeFn.visData) {
              self.treeFn.visData = {};
            }
            if (self.treeFn.visData.order === undefined) {
              self.treeFn.visData.order = true;
            }
            self.orderSubtree(d, self.treeFn.visData.order);
            self.treeFn.visData.order = !self.treeFn.visData.order;
            self.update(undefined, 0);
          });

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style(
            'font-family',
            settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
          )
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d) {
            if (
              d.parent &&
              d.parent.parent &&
              self.superTreeRoots.length < 1 &&
              self.treeData &&
              (self.treeData.rerootable === undefined || self.treeData.rerootable === true)
            ) {
              textSum += textInc;
              return 'Reroot';
            }
            return '';
          })
          .on('click', function (d) {
            self.unCollapseAll(self.root);
            forester.reRoot(tree, d, -1);
            self.resetDepthCollapseDepthValue();
            self.resetRankCollapseRankValue();
            self.resetBranchLengthCollapseValue();
            self.resetCollapseByFeature();
            self.zoomToFit();
          });

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style('font-family', 'Helvetica')
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d: Alcmonavis.phylo) {
            if (d.parent) {
              textSum += textInc;
              return 'List External Node Data';
            }
            return '';
          })
          .on('click', function (d) {
            listExternalNodeData(d);
          });

        d3.select(this)
          .append('text')
          .attr('class', 'tooltipElem tooltipElemText')
          .attr('y', topPad + textSum)
          .attr('x', +rightPad)
          .style('text-align', 'left')
          .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
          .style('font-size', fs)
          .style('font-family', 'Helvetica')
          .style('font-style', 'normal')
          .style('font-weight', 'bold')
          .style('text-decoration', 'none')
          .text(function (d) {
            if (
              d.parent &&
              self.basicTreeProperties &&
              self.basicTreeProperties.sequences &&
              self.basicTreeProperties.maxMolSeqLength &&
              self.basicTreeProperties.maxMolSeqLength > 0
            ) {
              textSum += textInc;
              return 'List Sequences in Fasta';
            }
            return '';
          })
          .on('click', function (d) {
            listMolecularSequences(d);
          });

        if (settings.enableAccessToDatabases === true) {
          d3.select(this)
            .append('text')
            .attr('class', 'tooltipElem tooltipElemText')
            .attr('y', topPad + textSum)
            .attr('x', +rightPad)
            .style('text-align', 'left')
            .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
            .style('font-size', fs)
            .style('font-family', 'Helvetica')
            .style('font-style', 'normal')
            .style('font-weight', 'bold')
            .style('text-decoration', 'none')
            .text(function (d) {
              var show = false;
              var value = null;
              if (d.sequences) {
                for (var i = 0; i < d.sequences.length; ++i) {
                  var s = d.sequences[i];
                  if (s.accession && s.accession.value && s.accession.source) {
                    var source = s.accession.source.toUpperCase();
                    if (
                      source === AP.ACC_GENBANK ||
                      source === AP.ACC_REFSEQ ||
                      source === AP.ACC_UNIPROT ||
                      source === AP.ACC_UNIPROTKB ||
                      source === AP.ACC_SWISSPROT ||
                      source === AP.ACC_TREMBL ||
                      source === 'UNKNOWN' ||
                      source === '?'
                    ) {
                      show = true;
                      value = s.accession.value;
                      break;
                    }
                  }
                }
              }
              if (d.name) {
                if (AP.RE_SWISSPROT_TREMBL.test(d.name)) {
                  show = true;
                  value = d.name;
                } else if (AP.RE_SWISSPROT_TREMBL_PFAM.test(d.name)) {
                  show = true;
                  value = AP.RE_SWISSPROT_TREMBL_PFAM.exec(d.name)![1];
                }
              }
              if (show) {
                textSum += textInc;
                return 'Access DB [' + value + ']';
              }
              return '';
            })
            .on('click', function (d) {
              accessDatabase(d);
            });
        }

        if (settings.enableSubtreeDeletion === true) {
          d3.select(this)
            .append('text')
            .attr('class', 'tooltipElem tooltipElemText')
            .attr('y', topPad + textSum)
            .attr('x', +rightPad)
            .style('text-align', 'left')
            .style('align', 'left')
            .style('fill', AP.NODE_TOOLTIP_TEXT_COLOR)
            .style('font-size', fs)
            .style(
              'font-family',
              settings.controlsFont.map((v) => (/\s/.test(v) ? '"' + v + '"' : v)).reduce((p, v) => p + ', ' + v),
            )
            .style('font-style', 'normal')
            .style('font-weight', 'bold')
            .style('text-decoration', 'none')
            .text(function (d) {
              if (d.parent && d.parent.parent && d.parent.parent.parent && self.superTreeRoots.length < 1) {
                textSum += textInc;
                if (d.children || d._children) {
                  if (d.children && d.children.length > 1) {
                    return 'Delete Subtree';
                  } else if (d._children && d._children.length > 1) {
                    return 'Delete Collapsed Subtree';
                  }
                } else {
                  return 'Delete External Node';
                }
              }
              return '';
            })
            .on('click', function (d) {
              self.unCollapseAll(self.root);
              forester.deleteSubtree(tree, d);
              self.treeData = tree;
              self.basicTreeProperties = forester.collectBasicTreeProperties(self.treeData);
              self.updateNodeVisualizationsAndLegends(self.treeData);
              self.resetDepthCollapseDepthValue();
              self.resetRankCollapseRankValue();
              self.resetBranchLengthCollapseValue();
              self.resetCollapseByFeature();
              self.search0Text(self.searchQueries[0]);
              //self.search0();
              self.search1();
              self.zoomToFit();
            });
        }

        (d3.selection.prototype as CustomD3Prototype<HTMLElement>).moveToFront = function () {
          return this.each(
            (() => {
              const _: (this: HTMLElement) => void = function () {
                if (this.parentNode) {
                  this.parentNode.appendChild(this);
                }
              };
              return _;
            })(),
          );
        };
        (d3.select(this) as CustomD3Prototype<HTMLElement>).moveToFront();
        d3.select(this)
          .selectAll('.tooltipElemText')
          .each(
            (() => {
              const _1: (this: HTMLElement, d: any) => void = function (d) {
                d3.select(this).on(
                  'mouseover',
                  (() => {
                    const _2: (this: HTMLElement, d: any) => void = function (d) {
                      d3.select(this).transition().duration(50).style('fill', AP.NODE_TOOLTIP_TEXT_ACTIVE_COLOR);
                    };
                    return _2;
                  })(),
                );
                d3.select(this).on(
                  'mouseout',
                  (() => {
                    const _3: (this: HTMLElement, d: any) => void = function (d) {
                      d3.select(this).transition().duration(50).style('fill', AP.NODE_TOOLTIP_TEXT_COLOR);
                    };
                    return _3;
                  })(),
                );
              };
              return _1;
            })(),
          );
      };
      return _;
    };

    return nodeClick(this);
  };

  updateNodeVisualizationsAndLegends = (tree: Alcmonavis.phylo) => {
    this.visualizations = null;
    var nodeProperties = forester.collectProperties(tree, 'node', false);

    if (this.settings && this.settings.valuesToIgnoreForNodeVisualization) {
      this.deleteValuesFromNodeProperties(this.settings.valuesToIgnoreForNodeVisualization, nodeProperties);
    }
    this.initializeNodeVisualizations(nodeProperties);
    this.visualizations = this.visualizations!;

    if (
      this.showLegends &&
      this.settings &&
      this.options &&
      (this.settings.enableNodeVisualizations || this.settings.enableBranchVisualizations) &&
      (this.legendColorScales[AP.LEGEND_LABEL_COLOR] ||
        (this.options.showNodeVisualizations &&
          (this.legendColorScales[AP.LEGEND_NODE_FILL_COLOR] ||
            this.legendColorScales[AP.LEGEND_NODE_BORDER_COLOR] ||
            this.legendShapeScales[AP.LEGEND_NODE_SHAPE] ||
            this.legendSizeScales[AP.LEGEND_NODE_SIZE])))
    ) {
      if (
        this.legendColorScales[AP.LEGEND_LABEL_COLOR] &&
        this.visualizations.labelColor &&
        this.currentLabelColorVisualization &&
        this.visualizations.labelColor[this.currentLabelColorVisualization]
      ) {
        this.removeLegend(AP.LEGEND_LABEL_COLOR);
        this.addLegend(AP.LEGEND_LABEL_COLOR, this.visualizations.labelColor[this.currentLabelColorVisualization]);
      }
      if (
        this.legendColorScales[AP.LEGEND_NODE_FILL_COLOR] &&
        this.visualizations.nodeFillColor &&
        this.currentNodeFillColorVisualization &&
        this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization]
      ) {
        this.removeLegend(AP.LEGEND_NODE_FILL_COLOR);
        this.addLegend(
          AP.LEGEND_NODE_FILL_COLOR,
          this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization],
        );
      }

      if (
        this.legendColorScales[AP.LEGEND_NODE_BORDER_COLOR] &&
        this.visualizations.nodeBorderColor &&
        this.currentNodeBorderColorVisualization &&
        this.visualizations.nodeBorderColor[this.currentNodeBorderColorVisualization]
      ) {
        this.removeLegend(AP.LEGEND_NODE_BORDER_COLOR);
        this.addLegend(
          AP.LEGEND_NODE_BORDER_COLOR,
          this.visualizations.nodeBorderColor[this.currentNodeBorderColorVisualization],
        );
      }
      if (
        this.legendShapeScales[AP.LEGEND_NODE_SHAPE] &&
        this.visualizations.nodeShape &&
        this.currentNodeShapeVisualization &&
        this.visualizations.nodeShape[this.currentNodeShapeVisualization]
      ) {
        this.removeShapeLegend(AP.LEGEND_NODE_SHAPE);
        this.addLegendForShapes(
          AP.LEGEND_NODE_SHAPE,
          this.visualizations.nodeShape[this.currentNodeShapeVisualization],
        );
      }
      if (
        this.legendSizeScales[AP.LEGEND_NODE_SIZE] &&
        this.visualizations.nodeSize &&
        this.currentNodeSizeVisualization &&
        this.visualizations.nodeSize[this.currentNodeSizeVisualization]
      ) {
        this.removeSizeLegend(AP.LEGEND_NODE_SIZE);
        this.addLegendForSizes(AP.LEGEND_NODE_SIZE, this.visualizations.nodeSize[this.currentNodeSizeVisualization]);
      }
    }
  };

  zoomInX = (zoomInFactor?: number) => {
    this.zoomed_x_or_y = true;
    if (zoomInFactor) {
      this.displayWidth = this.displayWidth * zoomInFactor;
    } else {
      this.displayWidth = this.displayWidth * AP.BUTTON_ZOOM_IN_FACTOR;
    }
    this.update(undefined, 0);
  };

  zoomInY = (zoomInFactor?: number) => {
    this.zoomed_x_or_y = true;
    if (zoomInFactor) {
      this.displayHeight = this.displayHeight * zoomInFactor;
    } else {
      this.displayHeight = this.displayHeight * AP.BUTTON_ZOOM_IN_FACTOR;
    }
    this.update(undefined, 0);
  };

  zoomOutX = (zoomOutFactor?: number) => {
    this.zoomed_x_or_y = true;
    var newDisplayWidth;
    if (zoomOutFactor) {
      newDisplayWidth = this.displayWidth * zoomOutFactor;
    } else {
      newDisplayWidth = this.displayWidth * AP.BUTTON_ZOOM_OUT_FACTOR;
    }
    if (newDisplayWidth - this.calcMaxTreeLengthForDisplay() >= 1) {
      this.displayWidth = newDisplayWidth;
      this.update(undefined, 0);
    }
  };

  zoomOutY = (zoomOutFactor?: number) => {
    this.zoomed_x_or_y = true;
    if (zoomOutFactor) {
      this.displayHeight = this.displayHeight * zoomOutFactor;
    } else {
      this.displayHeight = this.displayHeight * AP.BUTTON_ZOOM_OUT_FACTOR;
    }
    var min = 40;
    if (this.displayHeight < min) {
      this.displayHeight = min;
    }
    this.update(undefined, 0);
  };

  zoomToFit = () => {
    this.zoomed_x_or_y = false;
    if (this.root) {
      this.calcMaxExtLabel();
      this.intitializeDisplaySize();
      //initializeSettings(this.settings); //TODO why is/was this called here?
      this.removeColorPicker();
      this.zoomListener.scale(1);
      this.update(this.root, 0);
      this.centerNode(this.root, (this.settings && this.settings.rootOffset) || 0, AP.TOP_AND_BOTTOM_BORDER_HEIGHT);
    }
  };

  returnToSupertreeButtonPressed = () => {
    if (this.root && this.superTreeRoots.length > 0) {
      this.root = this.superTreeRoots.pop()!;
      this.basicTreeProperties = forester.collectBasicTreeProperties(this.root);
      this.updateNodeVisualizationsAndLegends(this.root);
      this.resetDepthCollapseDepthValue();
      this.resetRankCollapseRankValue();
      this.resetBranchLengthCollapseValue();
      this.search0Text(this.searchQueries[0]);
      //this.search0();
      this.search1();
      this.zoomToFit();
    }
  };

  orderButtonPressed = () => {
    if (this.root) {
      if (!this.treeFn.visData) {
        this.treeFn.visData = {};
      }
      if (this.treeFn.visData.order === undefined) {
        this.treeFn.visData.order = true;
      }
      this.orderSubtree(this.root, this.treeFn.visData.order);
      this.treeFn.visData.order = !this.treeFn.visData.order;
      this.update(undefined, 0);
    }
  };

  uncollapseAllButtonPressed = () => {
    if (this.root && forester.isHasCollapsedNodes(this.root)) {
      this.unCollapseAll(this.root);
      this.resetDepthCollapseDepthValue();
      this.resetRankCollapseRankValue();
      this.resetBranchLengthCollapseValue();
      this.resetCollapseByFeature();
      this.zoomToFit();
    }
  };

  midpointRootButtonPressed = () => {
    if (
      this.root &&
      this.superTreeRoots.length < 1 &&
      this.treeData &&
      (this.treeData.rerootable === undefined || this.treeData.rerootable === true)
    ) {
      this.unCollapseAll(this.root);
      forester.midpointRoot(this.root);
      this.resetDepthCollapseDepthValue();
      this.resetRankCollapseRankValue();
      this.resetBranchLengthCollapseValue();
      this.resetCollapseByFeature();
      this.zoomToFit();
    }
  };

  escPressed = () => {
    var width = 0;
    if (this.settings && this.settings.enableDynamicSizing) {
      var container = document.getElementById(this.id.replace('#', ''));
      if (container) {
        this.displayHeight = container.clientHeight;
        this.displayWidth = container.clientWidth;
        width = this.displayWidth;
      }
    }
    if (this.settings && (this.settings.enableNodeVisualizations || this.settings.enableBranchVisualizations)) {
      this.legendReset();
    }
    this.zoomToFit();
    if (this.settings && (this.settings.enableNodeVisualizations || this.settings.enableBranchVisualizations)) {
      var c0 = $('#' + this.settings.controls0);
      if (c0) {
        c0.css({
          left: this.settings.controls0Left || 0,
          top: (this.settings.controls0Top || 0) + this.offsetTop,
        });
      }
      var c1 = $('#' + this.settings.controls1);
      if (c1) {
        if (this.settings.enableDynamicSizing) {
          c1.css({
            left: width - (this.settings.controls1Width || 0),
            top: (this.settings.controls1Top || 0) + this.offsetTop,
          });
        } else {
          c1.css({
            left: this.settings.controls1Left || 0,
            top: (this.settings.controls1Top || 0) + this.offsetTop,
          });
        }
      }
    }
    if (this.options && this.options.searchAinitialValue) {
      $('#' + AP.SEARCH_FIELD_0).val(this.options.searchAinitialValue);
      this.search0();
    }
    if (this.options && this.options.searchBinitialValue) {
      $('#' + AP.SEARCH_FIELD_1).val(this.options.searchBinitialValue);
      this.search1();
    }
  };

  search0Text = (query: string) => {
    this.foundNodes0.clear();
    this.searchBox0Empty = true;
    if (query && query.length > 0) {
      var my_query = query.trim();
      if (my_query.length > 0) {
        this.searchBox0Empty = false;
        this.searchQueries[0] = my_query;
        this.foundNodes0 = this.search(my_query);
      }
    }
    this.update(undefined, 0, true);
  };

  search0 = () => {
    this.foundNodes0.clear();
    this.searchBox0Empty = true;
    var query = $('#' + AP.SEARCH_FIELD_0).val() as string | undefined;
    if (query && query.length > 0) {
      var my_query = query.trim();
      if (my_query.length > 0) {
        this.searchBox0Empty = false;
        this.foundNodes0 = this.search(my_query);
      }
    }
    this.update(undefined, 0, true);
  };

  search1 = () => {
    this.foundNodes1.clear();
    this.searchBox1Empty = true;
    var query = $('#' + AP.SEARCH_FIELD_1).val() as string | undefined;
    if (query && query.length > 0) {
      var my_query = query.trim();
      if (my_query.length > 0) {
        this.searchBox1Empty = false;
        this.foundNodes1 = this.search(my_query);
      }
    }
    this.update(undefined, 0, true);
  };

  resetSearch0 = () => {
    this.foundNodes0.clear();
    delete this.searchQueries[0];
    this.searchBox0Empty = true;
    $('#' + AP.SEARCH_FIELD_0).val('');
    this.update(undefined, 0, true);
    //update(null, 0, true); // Does this need to be called twice?
  };

  resetSearch1 = () => {
    this.foundNodes1.clear();
    this.searchBox1Empty = true;
    $('#' + AP.SEARCH_FIELD_1).val('');
    this.update(undefined, 0, true);
    //update(null, 0, true); // Here too?
  };

  search = (query: string) => {
    return forester.searchData(
      query,
      this.root,
      (this.options && this.options.searchIsCaseSensitive) || false,
      (this.options && this.options.searchIsPartial) || false,
      (this.options && this.options.searchUsesRegex) || false,
      (this.options && this.options.searchProperties) || false,
    );
  };

  toPhylogram = () => {
    this.options!.phylogram = true;
    this.options!.alignPhylogram = false;
    //this.setDisplayTypeButtons();
    this.TriggerHandler('displayType');
    this.update(undefined, 0);
  };

  toAlignedPhylogram = () => {
    this.options!.phylogram = true;
    this.options!.alignPhylogram = true;
    //this.setDisplayTypeButtons();
    this.TriggerHandler('displayType');
    this.update(undefined, 0);
  };

  toCladegram = () => {
    this.options!.phylogram = false;
    this.options!.alignPhylogram = false;
    //this.setDisplayTypeButtons();
    this.TriggerHandler('displayType');
    this.update(undefined, 0);
  };

  nodeNameCbClicked = () => {
    this.options!.showNodeName = this.getCheckboxValue(AP.NODE_NAME_CB);
    if (this.options!.showNodeName) {
      this.options!.showExternalLabels = true;
      this.TriggerHandler('showExternalLabels', this.options!.showExternalLabels);
    }
    this.update();
  };

  taxonomyCbClicked = () => {
    this.options!.showTaxonomy = this.getCheckboxValue(AP.TAXONOMY_CB);
    if (this.options!.showTaxonomy) {
      this.options!.showExternalLabels = true;
      this.TriggerHandler('showExternalLabels', this.options!.showExternalLabels);
    }
    this.update();
  };

  sequenceCbClicked = () => {
    this.options!.showSequence = this.getCheckboxValue(AP.SEQUENCE_CB);
    if (this.options!.showSequence) {
      this.options!.showExternalLabels = true;
      this.TriggerHandler('showExternalLabels', this.options!.showExternalLabels);
    }
    this.update();
  };

  confidenceValuesCbClicked = () => {
    this.options!.showConfidenceValues = this.getCheckboxValue(AP.CONFIDENCE_VALUES_CB);
    this.update();
  };

  branchLengthsCbClicked = () => {
    this.options!.showBranchLengthValues = this.getCheckboxValue(AP.BRANCH_LENGTH_VALUES_CB);
    this.update();
  };

  nodeEventsCbClicked = () => {
    this.options!.showNodeEvents = this.getCheckboxValue(AP.NODE_EVENTS_CB);
    this.update();
  };

  branchEventsCbClicked = () => {
    this.options!.showBranchEvents = this.getCheckboxValue(AP.BRANCH_EVENTS_CB);
    this.update();
  };

  internalLabelsCbClicked = () => {
    this.options!.showInternalLabels = this.getCheckboxValue(AP.INTERNAL_LABEL_CB);
    this.update();
  };

  externalLabelsCbClicked = () => {
    this.options!.showExternalLabels = this.getCheckboxValue(AP.EXTERNAL_LABEL_CB);
    this.update();
  };

  internalNodesCbClicked = () => {
    this.options!.showInternalNodes = this.getCheckboxValue(AP.INTERNAL_NODES_CB);
    this.update();
  };

  externalNodesCbClicked = () => {
    this.options!.showExternalNodes = this.getCheckboxValue(AP.EXTERNAL_NODES_CB);
    this.update();
  };

  nodeVisCbClicked = () => {
    this.options!.showNodeVisualizations = this.getCheckboxValue(AP.NODE_VIS_CB);
    this.resetVis();
    this.update(undefined, 0);
    //update(null, 0); // this one three?!
  };

  branchVisCbClicked = () => {
    this.options!.showBranchVisualizations = this.getCheckboxValue(AP.BRANCH_VIS_CB);
    this.resetVis();
    this.update(undefined, 0);
    //update(null, 0); // and four??!
  };

  branchColorsCbClicked = () => {
    this.options!.showBranchColors = this.getCheckboxValue(AP.BRANCH_COLORS_CB);
    this.update(undefined, 0);
  };

  dynaHideCbClicked = () => {
    this.options!.dynahide = this.getCheckboxValue(AP.DYNAHIDE_CB);
    this.resetVis();
    this.update(undefined, 0);
    // update(null, 0); // 5...
  };

  shortenCbClicked = () => {
    this.options!.shortenNodeNames = this.getCheckboxValue(AP.SHORTEN_NODE_NAME_CB);
    this.resetVis();
    this.update(undefined, 0);
  };

  downloadButtonPressed = () => {
    var s = $('#' + AP.EXPORT_FORMAT_SELECT);
    if (s) {
      var format = s.val() as string;
      this.downloadTree(format);
    }
  };

  changeBaseBackgoundColor = (color: string) => {
    var bg = $('.' + AP.BASE_BACKGROUND);
    if (bg) {
      bg.css({
        fill: color,
      });
    }
  };

  changeBranchWidth = (_e: JQueryEventObject, slider: JQueryUI.SliderUIParams) => {
    this.options!.branchWidthDefault = this.getSliderValue(slider);
    this.update(undefined, 0, true);
  };

  changeNodeSize = (_e: JQueryEventObject, slider: JQueryUI.SliderUIParams) => {
    this.options!.nodeSizeDefault = this.getSliderValue(slider);
    if (
      !this.options!.showInternalNodes &&
      !this.options!.showExternalNodes &&
      !this.options!.showNodeVisualizations &&
      !this.options!.showNodeEvents
    ) {
      this.options!.showInternalNodes = true;
      this.options!.showExternalNodes = true;
      this.TriggerHandler('showInternalNodes', this.options!.showInternalNodes);
      this.TriggerHandler('showExternalLabels', this.options!.showExternalLabels);
    }
    this.update(undefined, 0, true);
  };

  changeInternalFontSize = (_e: JQueryEventObject, slider: JQueryUI.SliderUIParams) => {
    this.options!.internalNodeFontSize = this.getSliderValue(slider);
    this.update(undefined, 0, true);
  };

  changeExternalFontSize = (_e: JQueryEventObject, slider: JQueryUI.SliderUIParams) => {
    this.options!.externalNodeFontSize = this.getSliderValue(slider);
    this.update(undefined, 0, true);
  };

  changeBranchDataFontSize = (_e: JQueryEventObject, slider: JQueryUI.SliderUIParams) => {
    this.options!.branchDataFontSize = this.getSliderValue(slider);
    this.update(undefined, 0, true);
  };

  updateMsaResidueVisCurrResPosFromSlider = (_e: JQueryEventObject, slider: JQueryUI.SliderUIParams) => {
    this.removeColorPicker();
    this.msa_residue_vis_curr_res_pos = (this.getSliderValue(slider) || 0) - 1;
    this.showMsaResidueVisualizationAsLabelColorIfNotAlreadyShown();
    this.update(undefined, 0, true);
  };

  searchOptionsCaseSenstiveCbClicked = () => {
    this.options!.searchIsCaseSensitive = this.getCheckboxValue(AP.SEARCH_OPTIONS_CASE_SENSITIVE_CB);
    this.search0Text(this.searchQueries[0]);
    //this.search0();
    this.search1();
  };

  searchOptionsCompleteTermsOnlyCbClicked = () => {
    this.options!.searchIsPartial = !this.getCheckboxValue(AP.SEARCH_OPTIONS_COMPLETE_TERMS_ONLY_CB);
    if (this.options!.searchIsPartial === false) {
      this.options!.searchUsesRegex = false;
      this.TriggerHandler('searchUsesRegex', this.options!.searchUsesRegex);
    }
    this.search0Text(this.searchQueries[0]);
    //this.search0();
    this.search1();
  };

  searchOptionsRegexCbClicked = () => {
    this.options!.searchUsesRegex = this.getCheckboxValue(AP.SEARCH_OPTIONS_REGEX_CB);
    if (this.options!.searchUsesRegex === true) {
      this.options!.searchIsPartial = true;
      this.TriggerHandler('searchIsComplete', !this.options!.searchIsPartial);
    }
    this.search0Text(this.searchQueries[0]);
    //this.search0();
    this.search1();
  };

  searchOptionsNegateResultCbClicked = () => {
    this.options!.searchNegateResult = this.getCheckboxValue(AP.SEARCH_OPTIONS_NEGATE_RES_CB);
    this.search0Text(this.searchQueries[0]);
    //this.search0();
    this.search1();
  };

  legendMoveUp = (x: number | null | undefined) => {
    if (!x) {
      x = 10;
    }
    if (this.options && this.options.visualizationsLegendYpos && this.options.visualizationsLegendYpos > 0) {
      this.options.visualizationsLegendYpos -= x;
      this.removeColorPicker();
      this.update(undefined, 0);
    }
  };

  legendMoveDown = (x: number | null | undefined) => {
    if (!x) {
      x = 10;
    }
    if (
      this.options &&
      this.options.visualizationsLegendYpos &&
      this.options.visualizationsLegendYpos < this.displayHeight
    ) {
      this.options.visualizationsLegendYpos += x;
      this.removeColorPicker();
      this.update(undefined, 0);
    }
  };

  legendMoveRight = (x: number | null | undefined) => {
    if (!x) {
      x = 10;
    }
    if (
      this.options &&
      this.options.visualizationsLegendXpos &&
      this.options.visualizationsLegendXpos < this.displayWidth - 20
    ) {
      this.options.visualizationsLegendXpos += x;
      this.removeColorPicker();
      this.update(undefined, 0);
    }
  };

  legendMoveLeft = (x: number | null | undefined) => {
    if (!x) {
      x = 10;
    }
    if (this.options && this.options.visualizationsLegendXpos && this.options.visualizationsLegendXpos > 0) {
      this.options.visualizationsLegendXpos -= x;
      this.removeColorPicker();
      this.update(undefined, 0);
    }
  };

  moveLegendWithMouse = (ev: MouseEvent) => {
    // layerX/Y was deprecated 9 years ago!
    var x = ev.offsetX;
    var y = ev.offsetY - this.offsetTop;
    if (x > 0 && x < this.displayWidth) {
      this.options!.visualizationsLegendXpos = x;
    }
    if (y > 0 && y < this.displayHeight) {
      this.options!.visualizationsLegendYpos = y;
    }
    this.removeColorPicker();
    this.update(undefined, 0);
  };

  legendHorizVertClicked = () => {
    if (this.options!.visualizationsLegendOrientation === AP.VERTICAL) {
      this.options!.visualizationsLegendOrientation = AP.HORIZONTAL;
    } else {
      this.options!.visualizationsLegendOrientation = AP.VERTICAL;
    }
    this.removeColorPicker();
    this.update(undefined, 0);
  };

  legendShowClicked = () => {
    this.showLegends = !this.showLegends;
    if (!this.showLegends) {
      this.removeColorPicker();
    }
    this.update(undefined, 0, true);
  };

  legendResetClicked = () => {
    this.removeColorPicker();
    this.legendReset();
    this.update(undefined, 0, true);
  };

  legendReset = () => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    this.options.visualizationsLegendXpos = this.options.visualizationsLegendXposOrig;
    this.options.visualizationsLegendYpos = this.options.visualizationsLegendYposOrig;
  };

  legendColorRectClicked = (
    targetScale: d3.scale.Ordinal<string, string> | d3.scale.Linear<number, number>,
    legendLabel: string,
    legendDescription: string,
    clickedName: string | number,
    clickedIndex: number,
  ) => {
    this.addColorPicker(targetScale, legendLabel, legendDescription, clickedName, clickedIndex);
    this.update();
  };

  setSelectMenuValue = (id: string, valueToSelect: string) => {
    const element = document.getElementById(id) as HTMLSelectElement;
    if (element != null) {
      element.value = valueToSelect;
    }
  };

  getCheckboxValue = (id: string) => {
    return $('#' + id).is(':checked');
  };

  getSliderValue = (slider: JQueryUI.SliderUIParams) => {
    return slider.value;
  };

  setSliderValue(id: string, value: number) {
    var sli = $('#' + id);
    if (sli) {
      sli.slider('value', value);
    }
  }

  updateMsaResidueVisCurrResPosSliderValue = () => {
    var sli = $('#' + AP.MSA_RESIDUE_VIS_CURR_RES_POS_SLIDER_1);
    if (sli) {
      sli.slider('value', this.msa_residue_vis_curr_res_pos + 1);
    }
  };

  increaseFontSizes = () => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    this.options.externalNodeFontSize = +this.options.externalNodeFontSize;
    this.options.internalNodeFontSize = +this.options.internalNodeFontSize;
    this.options.branchDataFontSize = +this.options.branchDataFontSize;

    const step = AP.SLIDER_STEP * 2;
    const max = AP.FONT_SIZE_MAX - step;
    let up = false;

    if (this.options.externalNodeFontSize <= max) {
      this.options.externalNodeFontSize += step;
      up = true;
    }
    if (this.options.internalNodeFontSize <= max) {
      this.options.internalNodeFontSize += step;
      up = true;
    }
    if (this.options.branchDataFontSize <= max) {
      this.options.branchDataFontSize += step;
      up = true;
    }
    if (up) {
      this.setSliderValue(AP.EXTERNAL_FONT_SIZE_SLIDER, this.options.externalNodeFontSize);
      this.setSliderValue(AP.INTERNAL_FONT_SIZE_SLIDER, this.options.internalNodeFontSize);
      this.setSliderValue(AP.BRANCH_DATA_FONT_SIZE_SLIDER, this.options.branchDataFontSize);
      this.update(undefined, 0, true);
    }
  };

  decreaseFontSizes = () => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    this.options.externalNodeFontSize = +this.options.externalNodeFontSize;
    this.options.internalNodeFontSize = +this.options.internalNodeFontSize;
    this.options.branchDataFontSize = +this.options.branchDataFontSize;

    const step = AP.SLIDER_STEP * 2;
    const min = AP.FONT_SIZE_MIN + step;
    var up = false;
    if (this.options.externalNodeFontSize >= min) {
      this.options.externalNodeFontSize -= step;
      up = true;
    }
    if (this.options.internalNodeFontSize >= min) {
      this.options.internalNodeFontSize -= step;
      up = true;
    }
    if (this.options.branchDataFontSize >= min) {
      this.options.branchDataFontSize -= step;
      up = true;
    }
    if (up) {
      this.setSliderValue(AP.EXTERNAL_FONT_SIZE_SLIDER, this.options.externalNodeFontSize);
      this.setSliderValue(AP.INTERNAL_FONT_SIZE_SLIDER, this.options.internalNodeFontSize);
      this.setSliderValue(AP.BRANCH_DATA_FONT_SIZE_SLIDER, this.options.branchDataFontSize);
      this.update(undefined, 0, true);
    }
  };

  setLabelColorMenu = (value: string, style: 'legend' | 'check') => {
    if (value && value != AP.DEFAULT) {
      this.currentLabelColorVisualization = value;
      if ((style = 'legend')) {
        if (
          this.visualizations &&
          this.visualizations.labelColor &&
          this.visualizations.labelColor[this.currentLabelColorVisualization] != null
        ) {
          this.addLegend(AP.LEGEND_LABEL_COLOR, this.visualizations.labelColor[this.currentLabelColorVisualization]);
        }
      } else {
        this.options = this.options || {};
        this.options.showNodeName = true;
        this.options.showExternalLabels = true;
        this.options.showInternalLabels = true;
        this.TriggerHandler('showNodeName', this.options.showNodeName);
        this.TriggerHandler('showExternalLabels', this.options.showExternalLabels);
        this.TriggerHandler('showInternalLabels', this.options.showInternalLabels);
        //this.setCheckboxValue(AP.NODE_NAME_CB, true);
        //this.setCheckboxValue(AP.EXTERNAL_LABEL_CB, true);
        //this.setCheckboxValue(AP.INTERNAL_LABEL_CB, true);
      }
    } else {
      this.currentLabelColorVisualization = null;
      this.removeLegend(AP.LEGEND_LABEL_COLOR);
    }
    this.removeColorPicker();
    this.update(undefined, 0);
  };

  setFillColorMenu = (value: string, style: 'legend' | 'check') => {
    this.options = this.options || {};
    if (value && value != AP.DEFAULT) {
      if ((style = 'legend')) {
        if (
          !this.options.showExternalNodes &&
          !this.options.showInternalNodes &&
          this.currentNodeShapeVisualization == null
        ) {
          this.options.showExternalNodes = true;
          this.TriggerHandler('showExternalNodes', this.options.showExternalNodes);
          //alcmonavis.setCheckboxValue(AP.EXTERNAL_NODES_CB, true);
        }
        this.options.showNodeVisualizations = true;
        this.TriggerHandler('showNodeVisualizations', this.options.showExternalNodes);
        // alcmonavis.setCheckboxValue(AP.NODE_VIS_CB, true);
        this.currentNodeFillColorVisualization = value;
        if (
          this.visualizations &&
          this.visualizations.nodeFillColor &&
          this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization] != null
        ) {
          this.addLegend(
            AP.LEGEND_NODE_FILL_COLOR,
            this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization],
          );
        }
      } else {
        this.options.showExternalNodes = true;
        this.options.showInternalNodes = true;
        this.options.showNodeVisualizations = true;
        this.TriggerHandler('showExternalNodes', this.options.showNodeName);
        this.TriggerHandler('showInternalNodes', this.options.showExternalLabels);
        this.TriggerHandler('showNodeVisualizations', this.options.showInternalLabels);
      }
    } else {
      this.currentNodeFillColorVisualization = null;
      this.removeLegend(AP.LEGEND_NODE_FILL_COLOR);
    }
    this.removeColorPicker();
    this.update(undefined, 0);
  };

  setShapeSelectMenu = (value: string) => {
    this.options = this.options || {};
    if (value && value != AP.DEFAULT) {
      this.currentNodeShapeVisualization = value;
      this.options.showNodeVisualizations = true;
      this.TriggerHandler('showNodeVisualizations', this.options.showNodeVisualizations);

      if (
        this.visualizations &&
        this.visualizations.nodeShape &&
        this.visualizations.nodeShape[this.currentNodeShapeVisualization] != null
      ) {
        this.addLegend(AP.LEGEND_NODE_FILL_COLOR, this.visualizations.nodeShape[this.currentNodeShapeVisualization]);
      }
    } else {
      this.currentNodeShapeVisualization = null;
      this.removeLegendForShapes(AP.LEGEND_NODE_SHAPE);
    }
    this.removeColorPicker();
    this.resetVis();
    this.update(undefined, 0);
  };

  setSizeSelectMenu = (value: string) => {
    this.options = this.options || {};
    if (value && value != AP.DEFAULT) {
      this.currentNodeSizeVisualization = value;
      if (
        this.visualizations &&
        this.visualizations.nodeSize &&
        this.visualizations.nodeSize[this.currentNodeSizeVisualization] != null
      ) {
        this.addLegend(AP.LEGEND_NODE_FILL_COLOR, this.visualizations.nodeSize[this.currentNodeSizeVisualization]);
      }
      if (
        !this.options.showExternalNodes &&
        !this.options.showInternalNodes &&
        this.currentNodeShapeVisualization == null
      ) {
        this.options.showExternalNodes = true;
        this.TriggerHandler('showExternalNodes', this.options.showNodeName);
      }
      this.options.showNodeVisualizations = true;
      this.TriggerHandler('showNodeVisualizations', this.options.showNodeVisualizations);
    } else {
      this.currentNodeSizeVisualization = null;
      this.removeLegendForSizes(AP.LEGEND_NODE_SIZE);
    }
    this.removeColorPicker();
    this.update(undefined, 0);
  };

  getPropertyRefs = () => this.treeData && forester.collectPropertyRefs(this.treeData, 'node', false);

  createGui = () => {
    var d3selectId = d3.select(this.id);
    if (d3selectId && d3selectId[0]) {
      var phyloDiv = d3selectId[0][0] as HTMLElement;
      if (phyloDiv) {
        this.offsetTop = phyloDiv.offsetTop;
        phyloDiv.style.textAlign = 'left';
      }
    }

    var container = $(this.id);

    container.css({
      'font-style': 'normal',
      'font-weight': 'normal',
      'text-decoration': 'none',
      'text-align': 'left',
      borderColor: 'LightGray',
    });

    this.node_mouseover_div = d3
      .select('body')
      .append('div')
      .attr('class', 'node_mouseover_tooltip')
      .style('opacity', 1e-6);
  }; // function createGui()

  makeBackground = () => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    this.baseSvg
      .append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('opacity', 1)
      .attr('class', AP.BASE_BACKGROUND)
      .attr('fill', this.options.backgroundColorDefault);
  };

  orderSubtree = (n: Alcmonavis.phylo, order: boolean) => {
    var changed = false;
    ord(n);
    if (!changed) {
      order = !order;
      ord(n);
    }
    function ord(n: Alcmonavis.phylo) {
      if (!n.children) {
        return;
      }
      var c = n.children;
      var l = c.length;
      if (l == 2) {
        var e0 = forester.calcSumOfAllExternalDescendants(c[0]);
        var e1 = forester.calcSumOfAllExternalDescendants(c[1]);
        if (e0 !== e1 && e0 < e1 === order) {
          changed = true;
          var c0 = c[0];
          c[0] = c[1];
          c[1] = c0;
        }
      }
      for (var i = 0; i < l; ++i) {
        ord(c[i]);
      }
    }
  };

  cycleDisplay = () => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';

    if (this.options.phylogram && !this.options.alignPhylogram) {
      this.options.alignPhylogram = true;
    } else if (this.options.phylogram && this.options.alignPhylogram) {
      this.options.phylogram = false;
      this.options.alignPhylogram = false;
    } else if (!this.options.phylogram && !this.options.alignPhylogram) {
      this.options.phylogram = true;
    }
    //this.setDisplayTypeButtons();
    this.TriggerHandler('displayType');
    this.update(undefined, 0);
  };

  unCollapseAll = (node: Alcmonavis.phylo) => {
    forester.preOrderTraversal(node, function (n) {
      if (n._children) {
        n.children = n._children;
        n._children = null;
      }
      if (n[AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL]) {
        n[AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL] = undefined;
      }
    });
  };

  decrDepthCollapseLevel = () => {
    this.rank_collapse_level = -1;
    this.branch_length_collapse_level = -1;
    this.resetCollapseByFeature();
    if (this.root && this.treeData && this.external_nodes > 2) {
      if (this.depth_collapse_level <= 1) {
        this.depth_collapse_level = forester.calcMaxDepth(this.root);
        this.unCollapseAll(this.root);
      } else {
        --this.depth_collapse_level;
        forester.collapseToDepth(this.root, this.depth_collapse_level);
      }
    }
    this.update(undefined, 0);
  };

  incrDepthCollapseLevel = () => {
    this.rank_collapse_level = -1;
    this.branch_length_collapse_level = -1;
    this.resetCollapseByFeature();
    if (this.root && this.treeData && this.external_nodes > 2) {
      var max = forester.calcMaxDepth(this.root);
      if (this.depth_collapse_level >= max) {
        this.depth_collapse_level = 1;
      } else {
        this.unCollapseAll(this.root);
        ++this.depth_collapse_level;
      }
      forester.collapseToDepth(this.root, this.depth_collapse_level);
    }
    this.update(undefined, 0);
  };

  decrBlCollapseLevel = () => {
    this.rank_collapse_level = -1;
    this.depth_collapse_level = -1;
    this.resetCollapseByFeature();
    if (this.root && this.treeData && this.external_nodes > 2) {
      if (this.branch_length_collapse_level <= this.branch_length_collapse_data.min) {
        this.branch_length_collapse_level = this.branch_length_collapse_data.max;
      }
      this.branch_length_collapse_level -= this.branch_length_collapse_data.step;
      forester.collapseToBranchLength(this.root, this.branch_length_collapse_level);
    }
    this.update(undefined, 0);
  };

  incrBlCollapseLevel = () => {
    this.rank_collapse_level = -1;
    this.depth_collapse_level = -1;
    this.resetCollapseByFeature();
    if (this.root && this.treeData && this.external_nodes > 2) {
      if (
        this.branch_length_collapse_level >= this.branch_length_collapse_data.max ||
        this.branch_length_collapse_level < 0
      ) {
        this.branch_length_collapse_level = this.branch_length_collapse_data.min;
      }
      this.branch_length_collapse_level += this.branch_length_collapse_data.step;
      if (this.branch_length_collapse_level >= this.branch_length_collapse_data.max) {
        this.unCollapseAll(this.root);
      } else {
        forester.collapseToBranchLength(this.root, this.branch_length_collapse_level);
      }
    }
    this.update(undefined, 0);
  };

  decrMsaResidueVisCurrResPos = () => {
    if (this.msa_residue_vis_curr_res_pos <= 0) {
      this.msa_residue_vis_curr_res_pos = this.basicTreeProperties!.maxMolSeqLength! - 1;
    } else {
      this.msa_residue_vis_curr_res_pos -= 1;
    }
    this.updateMsaResidueVisCurrResPosSliderValue();
    this.showMsaResidueVisualizationAsLabelColorIfNotAlreadyShown();
    this.update(undefined, 0, true);
  };

  incrMsaResidueVisCurrResPos = () => {
    if (this.msa_residue_vis_curr_res_pos >= this.basicTreeProperties!.maxMolSeqLength! - 1) {
      this.msa_residue_vis_curr_res_pos = 0;
    } else {
      this.msa_residue_vis_curr_res_pos += 1;
    }
    this.updateMsaResidueVisCurrResPosSliderValue();
    this.showMsaResidueVisualizationAsLabelColorIfNotAlreadyShown();
    this.update(undefined, 0, true);
  };

  showMsaResidueVisualizationAsLabelColorIfNotAlreadyShown = () => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (!SettingsDeclared(this.settings)) throw 'Settings not set';

    if (
      (this.currentLabelColorVisualization == null || this.currentLabelColorVisualization === AP.DEFAULT) &&
      this.currentNodeFillColorVisualization != AP.MSA_RESIDUE &&
      this.currentNodeBorderColorVisualization != AP.MSA_RESIDUE &&
      this.currentNodeShapeVisualization != AP.MSA_RESIDUE &&
      this.isCanDoMsaResidueVisualizations()
    ) {
      this.currentLabelColorVisualization = AP.MSA_RESIDUE;
      $('#' + AP.LABEL_COLOR_SELECT_MENU).val(AP.MSA_RESIDUE);
      if (
        this.visualizations &&
        this.visualizations.labelColor &&
        this.visualizations.labelColor[this.currentLabelColorVisualization]
      ) {
        this.addLegend(AP.LEGEND_LABEL_COLOR, this.visualizations.labelColor[this.currentLabelColorVisualization]);
      }
      if (this.settings.enableBranchVisualizations) {
        this.options.showBranchVisualizations = true;
        this.TriggerHandler('showBranchVisualizations', this.options.showBranchVisualizations);
        //this.setCheckboxValue(AP.BRANCH_VIS_CB, this.options.showBranchVisualizations);
      }
    } else if (
      this.currentLabelColorVisualization != AP.MSA_RESIDUE &&
      (this.currentNodeFillColorVisualization == null || this.currentNodeFillColorVisualization === AP.DEFAULT) &&
      this.currentNodeBorderColorVisualization != AP.MSA_RESIDUE &&
      this.currentNodeShapeVisualization != AP.MSA_RESIDUE &&
      this.isCanDoMsaResidueVisualizations()
    ) {
      this.currentNodeFillColorVisualization = AP.MSA_RESIDUE;
      $('#' + AP.NODE_FILL_COLOR_SELECT_MENU).val(AP.MSA_RESIDUE);
      if (
        this.visualizations &&
        this.visualizations.nodeFillColor &&
        this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization]
      ) {
        this.addLegend(
          AP.LEGEND_NODE_FILL_COLOR,
          this.visualizations.nodeFillColor[this.currentNodeFillColorVisualization],
        );
      }
      if (this.settings.enableBranchVisualizations) {
        this.options.showBranchVisualizations = true;
        //this.setCheckboxValue(AP.BRANCH_VIS_CB, this.options.showBranchVisualizations);
        this.TriggerHandler('showBranchVisualizations', this.options.showBranchVisualizations);
      }
    } else if (
      this.currentLabelColorVisualization != AP.MSA_RESIDUE &&
      this.currentNodeFillColorVisualization != AP.MSA_RESIDUE &&
      (this.currentNodeBorderColorVisualization == null || this.currentNodeBorderColorVisualization === AP.DEFAULT) &&
      this.currentNodeShapeVisualization != AP.MSA_RESIDUE &&
      this.isCanDoMsaResidueVisualizations()
    ) {
      this.currentNodeBorderColorVisualization = AP.MSA_RESIDUE;
      $('#' + AP.NODE_BORDER_COLOR_SELECT_MENU).val(AP.MSA_RESIDUE);
      if (
        this.visualizations &&
        this.visualizations.nodeBorderColor &&
        this.visualizations.nodeBorderColor[this.currentNodeBorderColorVisualization]
      ) {
        this.addLegend(
          AP.LEGEND_NODE_BORDER_COLOR,
          this.visualizations.nodeBorderColor[this.currentNodeBorderColorVisualization],
        );
      }
      if (this.settings.enableBranchVisualizations) {
        this.options.showBranchVisualizations = true;
        //this.setCheckboxValue(AP.BRANCH_VIS_CB, this.options.showBranchVisualizations);
        this.TriggerHandler('showBranchVisualizations', this.options.showBranchVisualizations);
      }
    } else if (
      this.currentLabelColorVisualization != AP.MSA_RESIDUE &&
      this.currentNodeFillColorVisualization != AP.MSA_RESIDUE &&
      this.currentNodeBorderColorVisualization != AP.MSA_RESIDUE &&
      (this.currentNodeShapeVisualization == null || this.currentNodeShapeVisualization === AP.DEFAULT) &&
      this.isCanDoMsaResidueVisualizations()
    ) {
      this.currentNodeShapeVisualization = AP.MSA_RESIDUE;
      $('#' + AP.NODE_SHAPE_SELECT_MENU).val(AP.MSA_RESIDUE);
      if (
        this.visualizations &&
        this.visualizations.nodeShape &&
        this.visualizations.nodeShape[this.currentNodeShapeVisualization]
      ) {
        this.addLegend(AP.LEGEND_NODE_SHAPE, this.visualizations.nodeShape[this.currentNodeShapeVisualization]);
      }
    }
  };

  updateDepthCollapseDepthDisplay = () => {
    var v = this.obtainDepthCollapseDepthValue();
    $('#' + AP.DEPTH_COLLAPSE_LABEL).val(' ' + v);
  };

  updateBranchLengthCollapseBranchLengthDisplay = () => {
    var v = this.obtainBranchLengthCollapseBranchLengthValue();
    $('#' + AP.BL_COLLAPSE_LABEL).val(v);
  };

  collapseByFeature = (feature: string) => {
    this.rank_collapse_level = -1;
    this.depth_collapse_level = -1;
    this.branch_length_collapse_level = -1;
    if (feature === AP.SPECIES_FEATURE) {
      this.collapseSpecificSubtrees(this.root, null, AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL);
    } else if (feature === AP.OFF_FEATURE) {
      this.unCollapseAll(this.root);
    } else {
      this.collapseSpecificSubtrees(this.root, feature, AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL);
    }
    this.update(undefined, 0);
  };

  removeForCollapsedFeatureSpecialLabel = (
    phy: Alcmonavis.phylo,
    keyForCollapsedFeatureSpecialLabel: keyof Alcmonavis.specialLabels,
  ) => {
    forester.preOrderTraversalAll(phy, function (n) {
      if (n[keyForCollapsedFeatureSpecialLabel]) {
        n[keyForCollapsedFeatureSpecialLabel] = undefined;
      }
    });
  };

  collapseSpecificSubtrees = (
    phy: Alcmonavis.phylo,
    nodePropertyRef: string | null,
    keyForCollapsedFeatureSpecialLabel: keyof Alcmonavis.specialLabels,
  ) => {
    this.unCollapseAll(phy);

    if (nodePropertyRef && nodePropertyRef.length > 0) {
      forester.preOrderTraversalAll(phy, function (n) {
        if (n.children && !n._children && n.children.length > 1) {
          var pv = forester.getOneDistinctNodePropertyValue(n, nodePropertyRef);
          if (pv != null) {
            forester.collapse(n);
            if (keyForCollapsedFeatureSpecialLabel) {
              n[keyForCollapsedFeatureSpecialLabel] = '[' + nodePropertyRef + '] ' + pv;
            }
          }
        }
      });
    } else {
      forester.preOrderTraversalAll(phy, function (n) {
        if (n.children && !n._children && n.children.length > 1) {
          var tv = forester.getOneDistinctTaxonomy(n);
          if (tv != null) {
            forester.collapse(n);
            if (keyForCollapsedFeatureSpecialLabel) {
              n[keyForCollapsedFeatureSpecialLabel] = tv;
            }
          }
        }
      });
    }
  };

  resetCollapseByFeature = () => {
    var s = $('#' + AP.COLLAPSE_BY_FEATURE_SELECT);
    if (s) {
      var f = s.val();
      if (f != AP.OFF_FEATURE) {
        s.val(AP.OFF_FEATURE);
        this.removeForCollapsedFeatureSpecialLabel(this.root, AP.KEY_FOR_COLLAPSED_FEATURES_SPECIAL_LABEL);
      }
    }
  };

  updateMsaResidueVisCurrResPosLabel = () => {
    $('#' + AP.MSA_RESIDUE_VIS_CURR_RES_POS_LABEL).val(this.msa_residue_vis_curr_res_pos + 1);
  };

  setMsaResidueVisCurrResPos = (position: number) => {
    if (position <= 0) {
      this.msa_residue_vis_curr_res_pos = 0;
    } else if (
      this.basicTreeProperties &&
      this.basicTreeProperties.maxMolSeqLength &&
      position >= this.basicTreeProperties.maxMolSeqLength - 1
    ) {
      this.msa_residue_vis_curr_res_pos = this.basicTreeProperties.maxMolSeqLength - 1;
    } else {
      this.msa_residue_vis_curr_res_pos = position;
    }
  };

  updateButtonEnabledState = () => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (!SettingsDeclared(this.settings)) throw 'Settings not set';

    if (this.superTreeRoots && this.superTreeRoots.length > 0) {
      this.enableButton($('#' + AP.RETURN_TO_SUPERTREE_BUTTON));
    } else {
      this.disableButton($('#' + AP.RETURN_TO_SUPERTREE_BUTTON));
    }

    if (forester.isHasCollapsedNodes(this.root)) {
      this.enableButton($('#' + AP.UNCOLLAPSE_ALL_BUTTON));
    } else {
      this.disableButton($('#' + AP.UNCOLLAPSE_ALL_BUTTON));
    }
    if (
      this.superTreeRoots.length < 1 &&
      this.treeData &&
      (this.treeData.rerootable === undefined || this.treeData.rerootable === true)
    ) {
      this.enableButton($('#' + AP.MIDPOINT_ROOT_BUTTON));
    } else {
      this.disableButton($('#' + AP.MIDPOINT_ROOT_BUTTON));
    }
    var b = null;
    if (this.foundNodes0 && !this.searchBox0Empty) {
      b = $('#' + AP.RESET_SEARCH_A_BTN);
      if (b) {
        b.prop('disabled', false);
        if (this.foundNodes0.size < 1) {
          b.css('background', '');
          b.css('color', '');
        } else {
          b.css('background', this.options.found0ColorDefault);
          b.css('color', AP.WHITE);
        }
        var nd0 = this.foundNodes0.size === 1 ? 'node' : 'nodes';
        b.prop(
          'title',
          'found ' + this.foundNodes0.size + ' ' + nd0 + ' [click to ' + AP.RESET_SEARCH_A_BTN_TOOLTIP + ']',
        );
      }
    } else {
      b = $('#' + AP.RESET_SEARCH_A_BTN);
      if (b) {
        b.prop('disabled', true);
        b.css('background', this.settings.controlsBackgroundColor);
        b.css('color', '');
        b.prop('title', AP.RESET_SEARCH_A_BTN_TOOLTIP);
      }
    }

    if (this.foundNodes1 && !this.searchBox1Empty) {
      b = $('#' + AP.RESET_SEARCH_B_BTN);
      if (b) {
        b.prop('disabled', false);
        if (this.foundNodes1.size < 1) {
          b.css('background', '');
          b.css('color', '');
        } else {
          b.css('background', this.options.found1ColorDefault);
          b.css('color', AP.WHITE);
        }
        var nd1 = this.foundNodes1.size === 1 ? 'node' : 'nodes';
        b.prop(
          'title',
          'found ' + this.foundNodes1.size + ' ' + nd1 + ' [click to ' + AP.RESET_SEARCH_B_BTN_TOOLTIP + ']',
        );
      }
    } else {
      b = $('#' + AP.RESET_SEARCH_B_BTN);
      if (b) {
        b.prop('disabled', true);
        b.css('background', this.settings.controlsBackgroundColor);
        b.css('color', '');
        b.prop('title', AP.RESET_SEARCH_B_BTN_TOOLTIP);
      }
    }
  };

  updateLegendButtonEnabledState = () => {
    this.TriggerHandler('showLegend', this.showLegends);
    this.TriggerHandler(
      'legendenabled',
      Boolean(
        this.showLegends &&
          (this.legendColorScales[AP.LEGEND_LABEL_COLOR] ||
            (this.options &&
              this.options.showNodeVisualizations &&
              (this.legendColorScales[AP.LEGEND_NODE_FILL_COLOR] ||
                this.legendColorScales[AP.LEGEND_NODE_BORDER_COLOR] ||
                this.legendShapeScales[AP.LEGEND_NODE_SHAPE] ||
                this.legendSizeScales[AP.LEGEND_NODE_SIZE]))),
      ),
    );

    var b = $('#' + AP.LEGENDS_SHOW_BTN);
    if (b) {
      if (this.showLegends) {
        b.css('background', AP.COLOR_FOR_ACTIVE_ELEMENTS);
        b.css('color', AP.WHITE);
      } else {
        b.css('background', '');
        b.css('color', '');
      }
    }
    if (
      this.showLegends &&
      (this.legendColorScales[AP.LEGEND_LABEL_COLOR] ||
        (this.options &&
          this.options.showNodeVisualizations &&
          (this.legendColorScales[AP.LEGEND_NODE_FILL_COLOR] ||
            this.legendColorScales[AP.LEGEND_NODE_BORDER_COLOR] ||
            this.legendShapeScales[AP.LEGEND_NODE_SHAPE] ||
            this.legendSizeScales[AP.LEGEND_NODE_SIZE])))
    ) {
      this.enableButton($('#' + AP.LEGENDS_HORIZ_VERT_BTN));
      this.enableButton($('#' + AP.LEGENDS_MOVE_UP_BTN));
      this.enableButton($('#' + AP.LEGENDS_MOVE_DOWN_BTN));
      this.enableButton($('#' + AP.LEGENDS_MOVE_LEFT_BTN));
      this.enableButton($('#' + AP.LEGENDS_MOVE_RIGHT_BTN));
      this.enableButton($('#' + AP.LEGENDS_RESET_BTN));
    } else {
      this.disableButton($('#' + AP.LEGENDS_HORIZ_VERT_BTN));
      this.disableButton($('#' + AP.LEGENDS_MOVE_UP_BTN));
      this.disableButton($('#' + AP.LEGENDS_MOVE_DOWN_BTN));
      this.disableButton($('#' + AP.LEGENDS_MOVE_LEFT_BTN));
      this.disableButton($('#' + AP.LEGENDS_MOVE_RIGHT_BTN));
      this.disableButton($('#' + AP.LEGENDS_RESET_BTN));
    }
  };

  disableButton = (b: JQuery<HTMLButtonElement>) => {
    if (b) {
      b.prop('disabled', true);
      b.css('background', (this.settings && this.settings.controlsBackgroundColor) || AP.WHITE);
    }
  };

  enableButton = (b: JQuery<HTMLButtonElement>) => {
    if (b) {
      b.prop('disabled', false);
      b.css('background', '');
    }
  };

  obtainDepthCollapseDepthValue = () => {
    if (!(this.treeData && this.root)) {
      return '';
    }
    if (this.external_nodes < 3) {
      return 'off';
    } else if (this.depth_collapse_level < 0) {
      this.depth_collapse_level = forester.calcMaxDepth(this.root);
      return 'off';
    } else if (this.depth_collapse_level == forester.calcMaxDepth(this.root)) {
      return 'off';
    }
    return this.depth_collapse_level;
  };

  obtainBranchLengthCollapseBranchLengthValue = () => {
    if (!(this.treeData && this.root)) {
      return '';
    }
    if (!this.branch_length_collapse_data.min) {
      // BM what is collapse data?
      this.resetBranchLengthCollapseValue();
    }

    if (this.external_nodes < 3) {
      return 'off';
    } else if (this.branch_length_collapse_level <= this.branch_length_collapse_data.min) {
      return 'off';
    } else if (this.branch_length_collapse_level >= this.branch_length_collapse_data.max) {
      return 'off';
    }
    return this.branch_length_collapse_level;
  };

  resetDepthCollapseDepthValue = () => {
    this.depth_collapse_level = -1;
  };

  resetRankCollapseRankValue = () => {
    this.rank_collapse_level = -1;
  };

  resetBranchLengthCollapseValue = () => {
    this.branch_length_collapse_level = -1;
    this.branch_length_collapse_data.min = Number.MAX_VALUE;
    this.branch_length_collapse_data.max = 0;

    if (this.root) {
      forester.removeMaxBranchLength(this.root);
      var stats = forester.calcBranchLengthSimpleStatistics(this.root);
      this.branch_length_collapse_data.min = stats.min;
      this.branch_length_collapse_data.max = stats.max;
      this.branch_length_collapse_data.max =
        0.25 * (3 * this.branch_length_collapse_data.max + this.branch_length_collapse_data.min);
      var x = stats.n < 200 ? stats.n / 4 : 50;
      this.branch_length_collapse_data.step =
        (this.branch_length_collapse_data.max - this.branch_length_collapse_data.min) / x;
    }
  };

  getTreeAsSvg = () => {
    var container = this.id.replace('#', '');
    var wrapper = document.getElementById(container);
    var svg = wrapper && wrapper.querySelector('svg');
    if (svg && typeof window.XMLSerializer !== 'undefined') {
      return new XMLSerializer().serializeToString(svg);
    }
    throw "Cannot process SVG, browser doesn't support XMLSerializer";
  };

  downloadTree = (format: string) => {
    if (!OptionsDeclared(this.options)) throw 'Options not set';
    if (format === AP.PNG_EXPORT_FORMAT) {
      this.changeBaseBackgoundColor(this.options.backgroundColorForPrintExportDefault);
      this.downloadAsPng();
      this.changeBaseBackgoundColor(this.options.backgroundColorDefault);
    } else if (format === AP.SVG_EXPORT_FORMAT) {
      this.changeBaseBackgoundColor(this.options.backgroundColorForPrintExportDefault);
      this.downloadAsSVG();
      this.changeBaseBackgoundColor(this.options.backgroundColorDefault);
    } else if (format === AP.NH_EXPORT_FORMAT) {
      this.downloadAsNH();
    } else if (format === AP.PHYLOXML_EXPORT_FORMAT) {
      this.downloadAsPhyloXml();
    } else if (format === AP.PDF_EXPORT_FORMAT) {
      this.changeBaseBackgoundColor(this.options.backgroundColorForPrintExportDefault);
      this.downloadAsPdf();
      this.changeBaseBackgoundColor(this.options.backgroundColorDefault);
    }
  };

  downloadAsPhyloXml = () => {
    // if (!OptionsDeclared(this.options)) throw "Options not set";
    // var x = phyloXml.toPhyloXML(this.root, 9);
    // saveAs(new Blob([x], { type: "application/xml" }), this.options.nameForPhyloXmlDownload);
  };

  downloadAsNH = () => {
    // if (!OptionsDeclared(this.options)) throw "Options not set";
    // if (!SettingsDeclared(this.settings)) throw "Settings not set";
    // var nh = forester.toNewHampshire(this.root, 9, this.settings.nhExportReplaceIllegalChars, this.settings.nhExportWriteConfidences);
    // saveAs(new Blob([nh], { type: "application/txt" }), this.options.nameForNhDownload);
  };

  downloadAsSVG = () => {
    // if (!OptionsDeclared(this.options)) throw "Options not set";
    // var svg = this.getTreeAsSvg();
    // saveAs(new Blob([decodeURIComponent(encodeURIComponent(svg))], { type: "application/svg+xml" }), this.options.nameForSvgDownload);
  };

  downloadAsPdf = () => {};

  downloadAsPng = () => {
    // if (!OptionsDeclared(this.options)) throw "Options not set";
    // var svg = this.getTreeAsSvg();
    // var canvas = document.createElement('canvas');
    // canvg(canvas, svg);
    // canvas.toBlob((blob) => {
    //     saveAs(blob, this.options!.nameForPngDownload);
    // });
  };

  // --------------------------------------------------------------
  // Convenience methods for loading tree on HTML page
  // --------------------------------------------------------------

  /**
   *
   *
   * @param label
   * @param location
   * @param data
   * @param options
   * @param settings
   * @param newHamphshireConfidenceValuesInBrackets
   * @param newHamphshireConfidenceValuesAsInternalNames
   * @param nodeVisualizations
   */
  private launchArchaeopteryx = (
    label: string,
    location: string,
    data: string,
    options: Alcmonavis.Options | undefined | null,
    settings: Alcmonavis.Settings,
    newHamphshireConfidenceValuesInBrackets?: boolean,
    newHamphshireConfidenceValuesAsInternalNames?: boolean,
    nodeVisualizations?: Dict<Alcmonavis.NodeVisualisation>,
  ) => {
    var tree = null;
    try {
      tree = parseTree(
        location,
        data,
        newHamphshireConfidenceValuesInBrackets,
        newHamphshireConfidenceValuesAsInternalNames,
      );
    } catch (e) {
      alert(AP.ERROR + 'error while parsing tree: ' + e);
    }
    if (tree) {
      try {
        this.launch(label, tree, options, settings, nodeVisualizations);
      } catch (e) {
        alert(AP.ERROR + 'error while launching alcmonavis: ' + e);
        throw e;
      }
    }
  };
}

const HasValue = (v: any | null | undefined): boolean => v !== null && v !== undefined;

export function SettingsDeclared(
  settings: Alcmonavis.Settings | null | undefined,
): settings is Required<Alcmonavis.RequiredSettings> & Alcmonavis.OptionalSettings {
  return !!(
    settings &&
    HasValue(settings.collapseLabelWidth) &&
    HasValue(settings.controls0) &&
    HasValue(settings.controls0Left) &&
    HasValue(settings.controls0Top) &&
    HasValue(settings.controls1) &&
    HasValue(settings.controls1Top) &&
    HasValue(settings.controls1Width) &&
    HasValue(settings.controlsBackgroundColor) &&
    HasValue(settings.controlsFont) &&
    HasValue(settings.controlsFontColor) &&
    HasValue(settings.controlsFontSize) &&
    HasValue(settings.dynamicallyAddNodeVisualizations) &&
    HasValue(settings.enableAccessToDatabases) &&
    HasValue(settings.enableBranchVisualizations) &&
    HasValue(settings.enableCollapseByBranchLenghts) &&
    HasValue(settings.enableCollapseByFeature) &&
    HasValue(settings.enableCollapseByTaxonomyRank) &&
    HasValue(settings.enableDownloads) &&
    HasValue(settings.enableDynamicSizing) &&
    HasValue(settings.enableNodeVisualizations) &&
    HasValue(settings.enableSubtreeDeletion) &&
    HasValue(settings.nhExportReplaceIllegalChars) &&
    HasValue(settings.nhExportWriteConfidences) &&
    HasValue(settings.rootOffset) &&
    HasValue(settings.searchFieldWidth) &&
    HasValue(settings.showBranchColorsButton) &&
    HasValue(settings.showDynahideButton) &&
    HasValue(settings.showShortenNodeNamesButton) &&
    HasValue(settings.textFieldHeight) &&
    HasValue(settings.zoomToFitUponWindowResize)
  );
}

export function OptionsDeclared(
  options: Alcmonavis.Options | null | undefined,
): options is Required<Alcmonavis.RequiredOptions> & Alcmonavis.OptionalOptions {
  return !!(
    options &&
    HasValue(options.alignPhylogram) &&
    HasValue(options.backgroundColorDefault) &&
    HasValue(options.backgroundColorForPrintExportDefault) &&
    HasValue(options.branchColorDefault) &&
    HasValue(options.branchDataFontSize) &&
    HasValue(options.branchWidthDefault) &&
    HasValue(options.collapsedLabelLength) &&
    HasValue(options.decimalsForLinearRangeMeanValue) &&
    HasValue(options.defaultFont) &&
    HasValue(options.dynahide) &&
    HasValue(options.externalNodeFontSize) &&
    HasValue(options.found0ColorDefault) &&
    HasValue(options.found0and1ColorDefault) &&
    HasValue(options.found1ColorDefault) &&
    HasValue(options.initialCollapseDepth) &&
    HasValue(options.internalNodeFontSize) &&
    HasValue(options.labelColorDefault) &&
    HasValue(options.nameForNhDownload) &&
    HasValue(options.nameForPhyloXmlDownload) &&
    HasValue(options.nameForPngDownload) &&
    HasValue(options.nameForSvgDownload) &&
    HasValue(options.nodeLabelGap) &&
    HasValue(options.nodeSizeDefault) &&
    HasValue(options.nodeVisualizationsOpacity) &&
    HasValue(options.phylogram) &&
    HasValue(options.searchIsCaseSensitive) &&
    HasValue(options.searchIsPartial) &&
    HasValue(options.searchNegateResult) &&
    HasValue(options.searchProperties) &&
    HasValue(options.searchUsesRegex) &&
    HasValue(options.shortenNodeNames) &&
    HasValue(options.showBranchColors) &&
    HasValue(options.showBranchEvents) &&
    HasValue(options.showBranchLengthValues) &&
    HasValue(options.showBranchVisualizations) &&
    HasValue(options.showConfidenceValues) &&
    HasValue(options.showDistributions) &&
    HasValue(options.showExternalLabels) &&
    HasValue(options.showExternalNodes) &&
    HasValue(options.showInternalLabels) &&
    HasValue(options.showInternalNodes) &&
    HasValue(options.showNodeEvents) &&
    HasValue(options.showNodeName) &&
    HasValue(options.showNodeVisualizations) &&
    HasValue(options.showSequence) &&
    HasValue(options.showSequenceAccession) &&
    HasValue(options.showSequenceGeneSymbol) &&
    HasValue(options.showSequenceName) &&
    HasValue(options.showSequenceSymbol) &&
    HasValue(options.showTaxonomy) &&
    HasValue(options.showTaxonomyCode) &&
    HasValue(options.showTaxonomyCommonName) &&
    HasValue(options.showTaxonomyRank) &&
    HasValue(options.showTaxonomyScientificName) &&
    HasValue(options.showTaxonomySynonyms) &&
    HasValue(options.visualizationsLegendOrientation) &&
    HasValue(options.visualizationsLegendXpos) &&
    HasValue(options.visualizationsLegendXposOrig) &&
    HasValue(options.visualizationsLegendYpos) &&
    HasValue(options.visualizationsLegendYposOrig)
  );
}

export const parsePhyloXML = (data: string) => {
  var phy: Alcmonavis.phylo = phyloXml.parse(data, { trim: true, normalize: true })[0];
  forester.addParents(phy);
  return phy;
};

export const parseNewHampshire = forester.parseNewHampshire;

/**
 * Convenience method for loading tree on HTML page
 *
 * @param location
 * @param data
 * @param newHamphshireConfidenceValuesInBrackets
 * @param newHamphshireConfidenceValuesAsInternalNames
 * @returns {*}
 */
export const parseTree = (
  location: string,
  data: string,
  newHamphshireConfidenceValuesInBrackets?: boolean,
  newHamphshireConfidenceValuesAsInternalNames?: boolean,
): any => {
  if (newHamphshireConfidenceValuesInBrackets == undefined) {
    newHamphshireConfidenceValuesInBrackets = true;
  }
  if (newHamphshireConfidenceValuesAsInternalNames == undefined) {
    newHamphshireConfidenceValuesAsInternalNames = false;
  }
  var tree = null;
  if (location.substr(-3, 3).toLowerCase() === 'xml') {
    tree = parsePhyloXML(data);
  } else {
    tree = parseNewHampshire(
      data,
      newHamphshireConfidenceValuesInBrackets,
      newHamphshireConfidenceValuesAsInternalNames,
    );
  }
  return tree;
};
