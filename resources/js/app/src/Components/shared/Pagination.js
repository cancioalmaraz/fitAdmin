import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
    textPagination: {
        marginRight: theme.spacing(2)
    }
}));

const PaginationUi = React.memo(
    ({
        page = 1,
        totalPages = 1,
        totalItems = 1,
        handleChangePage = ()=>{},
        offset = 0,
        totalItemsInPage = 1,
        loading = false
    }) => {
        const classes = useStyles();
        return (
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                m={1}
                p={1}
            >
                <Box p={1}>
                    <Typography className={classes.textPagination}>
                        Mostrando {loading ? "..." : offset + 1} a{" "}
                        {loading ? "..." : offset + totalItemsInPage} de{" "}
                        {loading ? "..." : totalItems} entradas
                    </Typography>
                </Box>
                <Box p={1}>
                    <Pagination
                        count={totalPages}
                        variant="outlined"
                        shape="rounded"
                        page={page}
                        onChange={handleChangePage}
                        size="small"
                    />
                </Box>
            </Box>
        );
    }
);

export default PaginationUi;
