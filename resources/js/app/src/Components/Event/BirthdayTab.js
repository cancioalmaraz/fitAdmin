import React from "react";
import useGetClientBirthdays from "../../Hooks/useGetClientBirthdays";

const BirthdayTab = () => {
    const {
        previousBirthdayList,
        todayBirthdayList,
        tomorrowBirthdayList,
        nextBirthdayList
    } = useGetClientBirthdays();

    return <div></div>;
};

export default BirthdayTab;
