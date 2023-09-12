export interface Item {
  defindex: number;
  quality: number;
  craftable: boolean;
  tradable: boolean;
  killstreak: number;
  australium: boolean;
  effect: number | null;
  festive: boolean;
  paintkit: number | null;
  wear: number | null;
  quality2: number | null;
  craftnumber: number | null;
  crateseries: number | null;
  target: number | null;
  output: number | null;
  outputQuality: number | null;
  paint: number | null;
}

export const TEMPLATE: Item = {
  defindex: 0,
  quality: 0,
  craftable: true,
  tradable: true,
  killstreak: 0,
  australium: false,
  effect: null,
  festive: false,
  paintkit: null,
  wear: null,
  quality2: null,
  craftnumber: null,
  crateseries: null,
  target: null,
  output: null,
  outputQuality: null,
  paint: null,
};

/**
 * Format items as strings or objects
 */
export default class SKU {
  public static loadDefaults(item: Partial<Item>): Item {
    return { ...TEMPLATE, ...item };
  }

  /**
   * Convert SKU to item object
   * @param {String} sku SKU string
   * @param {Boolean} ignorePaint Ignore paint attribute
   * @return {Object} item Item object
   */
  public static fromString(sku: string, ignorePaint: boolean = false): Item {
    const item: Item = this.loadDefaults({});
    const sections = sku.split(';');
    const sectionCount = sections.length;

    if (sectionCount > 0) {
      if (isNum(sections[0])) {
        item.defindex = parseInt(sections[0]);
      }
      sections.shift();
    }

    if (sectionCount > 0) {
      if (isNum(sections[0])) {
        item.quality = parseInt(sections[0]);
      }
      sections.shift();
    }

    for (const section of sections) {
      if (section === 'uncraftable') item.craftable = false;
      else if (['untradeable', 'untradable'].includes(section))
        item.tradable = false;
      else if (section === 'australium') item.australium = true;
      else if (section === 'festive') item.festive = true;
      else if (section === 'strange') item.quality2 = 11;
      else if (section.startsWith('kt') && isNum(section.substring(2)))
        item.killstreak = parseInt(section.substring(2));
      else if (section.startsWith('u') && isNum(section.substring(1)))
        item.effect = parseInt(section.substring(1));
      else if (section.startsWith('pk') && isNum(section.substring(2)))
        item.paintkit = parseInt(section.substring(2));
      else if (section.startsWith('w') && isNum(section.substring(1)))
        item.wear = parseInt(section.substring(1));
      else if (section.startsWith('td') && isNum(section.substring(2)))
        item.target = parseInt(section.substring(2));
      else if (section.startsWith('n') && isNum(section.substring(1)))
        item.craftnumber = parseInt(section.substring(1));
      else if (section.startsWith('c') && isNum(section.substring(1)))
        item.crateseries = parseInt(section.substring(1));
      else if (section.startsWith('od') && isNum(section.substring(2)))
        item.output = parseInt(section.substring(2));
      else if (section.startsWith('oq') && isNum(section.substring(2)))
        item.outputQuality = parseInt(section.substring(2));
      else if (
        !ignorePaint &&
        section.startsWith('p') &&
        isNum(section.substring(1))
      )
        item.paint = parseInt(section.substring(1));
    }

    return item;
  }

  /**
   * Convert item object to SKU
   * @param {Object} item Item object
   * @param {Boolean} ignorePaint Ignore paint attribute
   * @return {String} sku SKU string
   */
  public static fromObject(
    item: Partial<Item>,
    ignorePaint: boolean = false,
  ): string {
    let sku: string = `${item.defindex};${item.quality}`;

    if (item.effect) sku += `;u${item.effect}`;
    if (item.australium === true) sku += ';australium';
    if (item.craftable === false) sku += ';uncraftable';
    if (item.tradable === false) sku += ';untradable';
    if (item.wear) sku += `;w${item.wear}`;
    if (typeof item.paintkit === 'number') sku += `;pk${item.paintkit}`;
    if (item.quality2 == 11) sku += ';strange';
    if (typeof item.killstreak === 'number' && item.killstreak !== 0)
      sku += `;kt-${item.killstreak}`;
    if (item.target) sku += `;td-${item.target}`;
    if (item.festive === true) sku += ';festive';
    if (item.craftnumber) sku += `;n${item.craftnumber}`;
    if (item.crateseries) sku += `;c${item.crateseries}`;
    if (item.output) sku += `;od-${item.output}`;
    if (item.outputQuality) sku += `;oq-${item.outputQuality}`;
    if (!ignorePaint && item.paint) sku += `;p${item.paint}`;

    return sku;
  }
}

function isNum(test: string): boolean {
  return /^-{0,1}\d+$/.test(test);
}
