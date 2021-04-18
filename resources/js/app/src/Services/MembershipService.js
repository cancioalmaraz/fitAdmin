import axios from "axios";

class MembershipService {
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

        return axios.get("/api/memberships", {
            params: urlSearchParams
        });
    }

    create(payment) {
        return axios.post("/api/memberships", payment);
    }
}

export default MembershipService;