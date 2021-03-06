import { useEffect, useState } from "react";

// Services
import ClientService from "../Services/ClientService";

const useGetClientBirthdays = () => {
    const clientService = new ClientService();

    const [previousBirthdayList, setPreviousBirthdayList] = useState({
        data: [],
        loading: true
    });

    const [todayBirthdayList, setTodayBirthdayList] = useState({
        data: [],
        loading: true
    });

    const [tomorrowBirthdayList, setTomorrowBirthdayList] = useState({
        data: [],
        loading: true
    });

    const [nextBirthdayList, setNextBirthdayList] = useState({
        data: [],
        loading: true
    });

    const setDataBirthdayList = (data = [], setList) => {
        setList(state => ({
            ...state,
            data: data
        }));
    };

    const startLoadingBirthdayList = setList => {
        setList(state => ({
            ...state,
            loading: true
        }));
    };

    const finishLoadingBirthdayList = setList => {
        setList(state => ({
            ...state,
            loading: false
        }));
    };

    const chargeClientList = (when, setList) => {
        startLoadingBirthdayList(setList);
        clientService
            .getAll(10000, 0, { birth_date: when })
            .then(httpSuccess => {
                setDataBirthdayList(httpSuccess.data.results, setList);
            })
            .finally(() => {
                finishLoadingBirthdayList(setList);
            });
    };

    useEffect(() => {
        chargeClientList("previous", setPreviousBirthdayList);
        chargeClientList("today", setTodayBirthdayList);
        chargeClientList("tomorrow", setTomorrowBirthdayList);
        chargeClientList("next", setNextBirthdayList);
    }, []);

    return {
        previousBirthdayList,
        todayBirthdayList,
        tomorrowBirthdayList,
        nextBirthdayList
    };
};

export default useGetClientBirthdays;
