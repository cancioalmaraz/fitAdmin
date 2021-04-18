class StateHelper {

    setData(data = {}, setList) {
        setList(state => ({
            ...state,
            data: data
        }));
    };

    startLoading(setList) {
        setList(state => ({
            ...state,
            loading: true
        }));
    };

    finishLoading(setList) {
        setList(state => ({
            ...state,
            loading: false
        }));
    };

}

export default StateHelper;
