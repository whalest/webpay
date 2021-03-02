/**
 * Нотификатор об оплате
 */
export interface INotifyFields {
  /** Время совершения транзакции */
  batch_timestamp: string;

  /** Валюта транзакции */
  currency_id: string;

  /** Сумма транзакции */
  amount: string;

  /**  Метод совершения транзакции. Возможные значения:
   * - test — совершена без реального процессинга карточки
   * - cc — банковская карточка
   * - erip — ЕРИП*/
  payment_method: string;

  /** Номер заказа в системе WEBPAY */
  order_id: string;

  /** Номер (имя) заказа, присвоенное магазином */
  site_order_id: string;

  /** Номер транзакции */
  transaction_id: string;

  /** Тип транзакции. Успешной оплате соответствуют значения: 1 и 4 */
  payment_type: string;

  /** Номер транзакции в системе VISA/MASTERCARD/БЕЛКАРТ */
  rrn: string;

  /** Электронная подпись (вычисляется в случае, если в настройках биллинг-аккаунта указан "Секретный ключ").
   * Представляет собой hex-последовательность и является результатом выполнения функции MD5. В качестве аргумента функции MD5 служит текстовая последовательность, полученная путем простой конкатенации следующих полей:
   * - batch_timestamp
   * - currency_id
   * - amount
   * - payment_method
   * - order_id
   * - site_order_id
   * - transaction_id
   * - payment_type
   * - rrn
   * - SecretKey
   */
  wsb_signature: string;

  /** Код платежа процессинга */
  action: string;

  /**Внутренний код WEBPAY результата операции  */
  rc: string;

  /** Код операции процессинга */
  approval: string;

  /** 	Код страны банка - эмитента в ISO 3166 - 1 alpha - 3. Для включения данного поля в нотификатор необходимо обратиться в support@webpay.by */
  country_alpha_three_code?: string;
}
