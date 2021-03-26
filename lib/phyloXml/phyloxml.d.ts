import { Stream } from "node:stream";

export declare module phyloXml {

    interface Options {
        trim?: boolean;
        normalize?: boolean;
        lowercase?: boolean;
        lowercasetags?: boolean;
    }

    interface phy {
        children?: phy[];
        [k: string]: any
    }

    /**
     * To parse phyloXML formatted trees from a stream asynchronously.
     *
     * @param stream - The stream to be parsed.
     * @param parseOptions - Options dict for the SAX parser.
     *                       (example: {trim: true, normalize: true}).
     */
    export function parseAsync(stream: Stream, parseOptions: Options): void;

    /**
     * To parse a phyloXML formatted source.
     *
     * @param source - The source.
     * @param parseOptions - Options dict for the SAX parser
     *                       (example: {trim: true, normalize: true}).
     * @returns {*} - Array of phylogentic tree objects.
     */
    export function parse(source: { toString(): string}, parseOptions: Options): any[];

    export function toPhyloXML(phy: phy, decPointsMax: number): string
}