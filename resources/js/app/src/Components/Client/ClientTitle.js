import React from "react";
import {
    Button,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Typography,
    withStyles
} from "@material-ui/core";
import MuiTableCell from "@material-ui/core/TableCell";

const TableCell = withStyles({
  root: {
    borderBottom: "none"
  }
})(MuiTableCell);

const ClientTitle = () => {
    return (
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align="left" style={{ padding: 0 }}>
                            <Typography variant="h5">
                                Clientes
                            </Typography>
                        </TableCell>
                        <TableCell align="right" style={{ padding: 0 }}>
                            <Button color="primary" variant="contained">
                                Añadir
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClientTitle;
