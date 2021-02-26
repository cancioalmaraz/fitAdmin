class Helpers {
    parseDate(date) {
        let dateParsed = "";
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (month < 10) {
            dateParsed = `${year}-0${month}-${day}`;
        } else {
            dateParsed = `${year}-${month}-${day}`;
        }
        return dateParsed;
    }
}

export default Helpers;
