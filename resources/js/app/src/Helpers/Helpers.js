import moment from "moment";

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

    getMessagesError(errorList) {
        let errorMessageList = [];
        for (const property in errorList) {
            errorMessageList.push(errorList[property].join(", "));
        }
        return errorMessageList;
    }

    transformTimeFromServer(time) {
        return moment(time, 'HH:mm:ss').add(moment().utcOffset() / 60, 'hours').format('HH:mm')
    };
}

export default Helpers;
