import axios from "axios";

class ClienService {
    getAll(limit = 10, offset = 0, filterList = {}) {
        const urlSearchParams = new URLSearchParams();

        urlSearchParams.append("limit", limit);
        urlSearchParams.append("offset", offset);

        for (const property in filterList) {
            if (filterList[property] !== ""){
                urlSearchParams.append(
                    `filterList[${property}]`,
                    filterList[property]
                );
            }
        }

        return axios.get("/api/clients", {
            params: urlSearchParams
        });
    }

    create(client){
        return axios.post("/api/clients", client);
    }
}

export default ClienService;
