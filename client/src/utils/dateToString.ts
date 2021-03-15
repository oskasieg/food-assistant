 const dateToString = (date: Date) => {
    const tmp = date.toString().slice(0, 16)
    

    return tmp.replace('T', ' ')
}

export default dateToString