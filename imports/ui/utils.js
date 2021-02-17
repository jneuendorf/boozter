import { ALLOWED_AMOUNT_UNITS } from '/imports/api/common'
import BeverageData from '/imports/api/beverages.json'


export const ml = (amount, unit) => {
    if (ALLOWED_AMOUNT_UNITS.includes(unit)) {
        const factorsByUnit = {
            ml: 1,
            'US fl oz': 28.4130625,
            'imp fl oz': 29.5735295625,
        }
        return amount * factorsByUnit[unit]
    }
    else {
        throw new Error(`Invalid amount unit '${unit}'`)
    }
}

/**
 * @param {number} amount
 * @param {string} unit
 * @param {number} abv
 */
export const alc = (amount, unit, abv) => {
    return ml(amount, unit) * abv / 100
}


/**
 * Aggregates history records with equal date and beverage names,
 * summing up the amounts normalized to ml.
 *
 * @param {{name: string, amount: number, amountUnit: string, createdAt: Date}[]} records
 * @returns {{aggregated: {date: string, amount: number, amountUnit: number}, records: []}}
 */
export const aggregatedHistory = (records, settings) => {
    const DATETIME_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' })
    const BEVERAGE_DICT = Object.fromEntries(
        settings.beverages.map(({ name, ...data }) => [name, data])
    )

    return Object.values(records.reduce(
        (historyByDate, record) => {
            const date = record.createdAt
            const key = DATETIME_FORMAT.format(date)

            if (!historyByDate[key]) {
                historyByDate[key] = {
                    aggregated: {
                        key,
                        date,
                        amount: 0,
                        amountUnit: 'ml',
                        calories: 0,
                    },
                    records: [],
                }
            }
            const {aggregated, records} = historyByDate[key]

            const beverage = BEVERAGE_DICT[record.name]
            aggregated.amount += alc(
                record.amount,
                record.amountUnit,
                beverage.abv,
            )
            aggregated.calories += (
                ml(record.amount, record.amountUnit)
                * beverage.calories / 100
            )
            records.push(record)

            // const recordAmount = ml(record.amount, record.amountUnit)

            // if (aggregation && aggregation.name === record.name) {
            //     historyByDate[date] = {
            //         ...aggregation,
            //         amount: aggregation.amount + recordAmount
            //     }
            // }
            // else {
            //     historyByDate[date] = {
            //         ...record,
            //         amount: recordAmount,
            //         amountUnit: 'ml',
            //     }
            // }
            return historyByDate
        },
        {},
    ))
}
