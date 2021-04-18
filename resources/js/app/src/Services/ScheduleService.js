import axios from "axios";

class ScheduleService {
    getAll(limit = 10, offset = 0, filterList = {}) {
        const urlSearchParams = new URLSearchParams();

        urlSearchParams.append("limit", limit);
        urlSearchParams.append("offset", offset);

        for (const property in filterList) {
            if (filterList[property] !== "") {
                urlSearchParams.append(
                    `filterList[${property}]`,
                    filterList[property]
                );
            }
        }

        return axios.get("/api/schedules", {
            params: urlSearchParams
        });
    }

    create(schedule) {
        return axios.post("/api/schedules", schedule);
    }
}

export default ScheduleService;
