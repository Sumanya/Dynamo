export const isDesktop = () => window.innerWidth > 991
export const isTablet = () => window.innerWidth <= 991 && window.innerWidth > 768
export const isMobile = () => window.innerWidth <= 768
export const amountFormatter= (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const indexTags = () => [
    {
        tag: 'Very Low Equity',
        range: 19,
        color: "rgb(255, 71, 26)"
    },
    {
        tag: 'Low Equity',
        range: 39,
        color: "rgb(246, 150, 30)"
    },
    {
        tag: 'Medium Equity',
        range: 59,
        color: "rgb(236, 219, 35)"
    },
    {
        tag: 'High Equity',
        range: 79,
        color: "rgb(174, 226, 40)"
    },
    {
        tag: 'Aggressive Equity',
        range: 99,
        color: "rgb(106, 215, 45)"
    },
]
export const getIndexParamsFromSignalValue = (signalValue) => {
    for (const tag of indexTags()) {
        if(signalValue <= tag.range){
            return tag;
        }
    }
}