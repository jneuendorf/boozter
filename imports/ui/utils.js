import { ALLOWED_AMOUNT_UNITS } from '/imports/api/common.js'


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

export const alc = (amount, unit, abv) => {
    return ml(amount, unit) * abv / 100
}


/**
 * Aggregates history records with equal date and beverage names,
 * summing up the amounts normalized to ml.
 *
 * @param {{name: string, amount: number, amountUnit: string, createdAt: Date}[]} records
 */
export const aggregatedHistory = (records, get_abv) => {
    const DATETIME_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' })

    return Object.values(records.reduce(
        (historyByDate, record) => {
            const date = DATETIME_FORMAT.format(record.createdAt)

            if (!historyByDate[date]) {
                historyByDate[date] = {
                    aggregated: {
                        date,
                        amount: 0,
                        amountUnit: 'ml',
                    },
                    records: [],
                }
            }
            const {aggregated, records} = historyByDate[date]

            // aggregated.amount += ml(record.amount, record.amountUnit)
            aggregated.amount += alc(
                record.amount,
                record.amountUnit,
                get_abv(record),
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
