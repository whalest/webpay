/**
 * Параметры указывающие, с какого времени производить отсчет отведенного для оплаты интервала (по умолчанию 20 минут).
 */
export interface IFieldsSession {
  /**
   * Параметр регулирования времени платежной сессии
   * - пропускается если указан *wsb_startsessdatetime*
   * @type UnixTimestamp
   * @example 1603383601
   */
  wsb_startsesstime?: number;

  /**
   * DateTime Параметр регулирования даты и времени платежной сессии
   * - используется вместо *wsb_startsesstime*
   * @type DateTime
   * @example 2020-10-22T16:20:01+03:00
   */
  wsb_startsessdatetime?: string;
}
