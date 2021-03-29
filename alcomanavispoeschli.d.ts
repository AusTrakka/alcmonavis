import d3 from "d3"
declare namespace Forester {
    interface branchData {
        width: string;
        color: RGB;
        confidences: Confidence[];
    }

    interface RGB {
        red: string;
        green: string;
        blue: string;
    }

    interface phylo extends branchData, d3.layout.cluster.Result {
        rooted: boolean;
        name?: string;
        branch_length?: number;
        taxonomies?: taxonomy[];
        properties?: property[];
        sequences?: sequence[];
        parent?: this;
        children?: this[];
        _children?: this[] | null;
        events: PhyloEvents;
        max?: number;
        hide?: boolean;
        id?: string;
    }

    interface PhyloEvents {
        speciations?: number;
        duplications?: number;
        losses?: number;
        type?: string
    }

    interface Confidence {
        value: number;
        type?: string;
        stddev?: number;
    }

    interface taxonomy {
        code: string;
        scientific_name: string;
        common_name: string;
        synonym: string;
        synonyms: string[]; //?
        id: property;
        rank: string;
    }

    interface property {
        ref: string;
        value: string;
        datatype: string;
        provider: string;
        applies_to: properties;
        source: string;
        comment?: string;
        unit?: string;
    }

    interface sequence {
        mol_seq: molSeq;
        name: string;
        gene_name: string;
        symbol: string;
        accession: property;
        location?: string;
        type?: string;
    }

    interface molSeq {
        value: string; //?
        is_aligned: boolean;
    }

    interface hasValue {
        value: string
    }

    interface TreeProperty {
        internalNodeData: boolean;
        nodeNames: boolean;
        longestNodeName: number;
        branchLengths: boolean;
        branchEvents?: boolean;
        confidences: boolean;
        nodeEvents: boolean;
        sequences: boolean;
        taxonomies: boolean;
        alignedMolSeqs: boolean;
        maxMolSeqLength?: number;
        externalNodesCount: number;
        molSeqResiduesPerPosition?: string[][] | null;
        averageBranchLength: number;
    }

    interface BranchStats {
        mean: number;
        min: number;
        max: number;
        n: number;
    }

    type properties = 'phylogeny' | 'clade' | 'node' | 'annotation' | 'parent_branch' | 'other';
    type NDF = "NN" | "TC" | "TN" | "TS" | "TI" | "SY" | "SN" | "GN" | "SS" | "SA" | "AN" | "XR" | "MS";
}

declare namespace Alcmonavis {
    interface Visualisation {
        label?: string;
        description: string;
        field: keyof Forester.phylo | null;
        cladePropertyRef?: string;
        mapping: Dict<string>;
        isRegex: boolean;
        mappingFn: MappingFunction;
        scaleType: string;
    }

    interface Visualisations {
        nodeSize?: Dict<Visualisation>;
        nodeFillColor?: Dict<Visualisation>;
        nodeBorderColor?: Dict<Visualisation>;
        nodeShape?: Dict<Visualisation>;
        labelColor?: Dict<Visualisation>;
    }

    interface NodeVisualisation {
        label?: string;
        description: string;
        field: keyof Forester.phylo | null;
        cladeRef: string | 'na';
        regex: boolean;
        shapes: Shape[];
        colors: string | 'na';
        sizes: number[] | null; //?
        colorsAlt?: number[];
    }

    interface SpecialVisulaisation {
        label: string;
        color: string;
        applies_to_ref: string; //?
        property_datatype: string; //?
        property_applies_to: string; //?
        property_values?: string[];
    }

    interface specialLabels {
        collapsed_spec_label?: string;
    }

    interface phylo extends Forester.phylo, specialLabels {
        distributions?: Distributrion[];
        date?: Distributrion; // BM ??
        distToRoot: number;
        hasVis?: boolean;
        x0: number;
        y0: number;
        avg: number;
        rerootable?: boolean;
    }

    interface Distributrion {
        desc: string
    }

    interface CollapseData {
        min: number;
        max: number;
        step: number;
    }


    interface Options {
        phylogram?: boolean;
        alignPhylogram?: boolean;
        dynahide?: boolean;
        searchAinitialValue?: string | null;
        searchBinitialValue?: string | null;
        showBranchLengthValues?: boolean;
        showConfidenceValues?: boolean;
        showNodeName?: boolean;
        shortenNodeNames?: boolean;
        showTaxonomy?: boolean;
        showTaxonomyCode?: boolean;
        showTaxonomyScientificName?: boolean;
        showTaxonomyCommonName?: boolean;
        showTaxonomyRank?: boolean;
        showTaxonomySynonyms?: boolean;
        showSequence?: boolean;
        showSequenceSymbol?: boolean;
        showSequenceName?: boolean;
        showSequenceGeneSymbol?: boolean;
        showSequenceAccession?: boolean;
        showDistributions?: boolean;
        showInternalNodes?: boolean;
        showExternalNodes?: boolean;
        showInternalLabels?: boolean;
        showExternalLabels?: boolean;
        branchWidthDefault?: number;
        branchColorDefault?: string;
        labelColorDefault?: string;
        backgroundColorDefault?: string;
        backgroundColorForPrintExportDefault?: string;
        found0ColorDefault?: string;
        found1ColorDefault?: string;
        found0and1ColorDefault?: string;
        defaultFont?: string[];
        nodeSizeDefault?: number;
        externalNodeFontSize?: string | number;
        internalNodeFontSize?: string | number;
        branchDataFontSize?: string | number;
        collapsedLabelLength?: number;
        nodeLabelGap?: number;
        minBranchLengthValueToShow?: number | null; //?
        minConfidenceValueToShow?: number | null; //?
        searchIsCaseSensitive?: boolean;
        searchIsPartial?: boolean;
        searchNegateResult?: boolean;
        searchUsesRegex?: boolean;
        searchProperties?: boolean;
        showNodeEvents?: boolean;
        showBranchEvents?: boolean;
        showNodeVisualizations?: boolean;
        showBranchVisualizations?: boolean;
        nodeVisualizationsOpacity?: number;
        showBranchColors?: boolean;
        decimalsForLinearRangeMeanValue?: number;
        treeName?: string | null;
        nameForNhDownload?: string;
        nameForPhyloXmlDownload?: string;
        nameForPngDownload?: string;
        nameForSvgDownload?: string;
        visualizationsLegendXpos?: number;
        visualizationsLegendYpos?: number;
        visualizationsLegendXposOrig?: number;
        visualizationsLegendYposOrig?: number;
        visualizationsLegendOrientation?: 'vertical' | 'horizontal'
        initialCollapseFeature?: string | null; //?
        initialCollapseDepth?: number;
    }

    interface Settings {
        controls1Width?: number;
        rootOffset?: number;
        enableDynamicSizing?: boolean;
        displayWidth?: number;
        displayHeight?: number;
        controlsFontSize?: number | string;
        controlsFontColor?: string;
        controlsFont?: string[];
        controls0?: string;
        controls0Left?: number;
        controls0Top?: number;
        controls1Top?: number;
        controls1Left?: number;
        controls1?: string;
        controlsBackgroundColor?: string;
        enableDownloads?: boolean;
        enableBranchVisualizations?: boolean;
        enableNodeVisualizations?: boolean;
        enableCollapseByBranchLenghts?: boolean;
        enableCollapseByTaxonomyRank?: boolean;
        enableCollapseByFeature?: boolean;
        nhExportWriteConfidences?: boolean;
        searchFieldWidth?: string;
        textFieldHeight?: string;
        collapseLabelWidth?: string;
        showBranchColorsButton?: boolean;
        showDynahideButton?: boolean;
        showShortenNodeNamesButton?: boolean;
        nhExportReplaceIllegalChars?: boolean;
        enableSubtreeDeletion?: boolean;
        enableAccessToDatabases?: boolean;
        enableMsaResidueVisualizations?: boolean;
        zoomToFitUponWindowResize?: boolean;
        dynamicallyAddNodeVisualizations?: boolean;
        readSimpleCharacteristics?: boolean;
        propertiesToIgnoreForNodeVisualization?: string[] | null //?
        valuesToIgnoreForNodeVisualization?: Dict<string> | null //?
        groupSpecies?: RefMapping | null;
        groupYears?: GroupMapping | null;

        // Actually Optional
        border?: string;
        specialProcessing?: string;
    }

    interface ColourPickerData {
        legendLabel: string;
        legendDescription: string;
        clickedName: string;
        clickedIndex: number;
        targetScale: MappingFunction;
        clickedOrigColor: string;
    }

    interface RefMapping {
        source?: string;
        target?: string;
    }

    interface GroupMapping extends RefMapping {
        ignore?: number[];
        groupsize?: number;
    }

    interface CustomCluster<T> extends d3.layout.Cluster<T> {
        visData?: ClusterVisData;
        clickEvent?: (this: EventTarget) => void;
    }

    interface ClusterVisData {
        order?: boolean;
    }

    type Shape = 'square' | 'diamond' | 'triangle-up' | 'triangle-down' | 'circle' | 'cross';
}

type voidFn<T> = (_: T) => void;
type Fn<T, K> = (_: T) => K;
type Dict<T> = { [k: string]: T }
type HTMLstring = string;
type MappingFunction = d3.scale.Ordinal<string, string> | d3.scale.Linear<number, number>;

interface CustomD3Prototype<T> extends d3.Selection<any> {
    moveToFront: (this: d3.Selection<T>) => void;
}