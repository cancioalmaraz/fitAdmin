import axios from "axios";

class CoachService {
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

        return axios.get("/api/coaches", {
            params: urlSearchParams
        });
    }

    create(coach) {
        return axios.post("/api/coaches", coach);
    }

    edit(coach) {
        return axios.put(`/api/coaches/${coach.id}`, coach);
    }

    delete(coach) {
        return axios.delete(`/api/coaches/${coach.id}`);
    }
}

export default CoachService;
