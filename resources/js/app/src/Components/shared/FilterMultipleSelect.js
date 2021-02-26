import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { VariableSizeList } from "react-window";
import {
    Button,
    ButtonGroup,
    Checkbox,
    FormControlLabel,
    Grid,
    Popper
} from "@material-ui/core";

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING
        }
    });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
    props,
    ref
) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = child => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={index => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

ListboxComponent.propTypes = {
    children: PropTypes.node
};

const useStyles = makeStyles(theme => ({
    listbox: {
        boxSizing: "border-box",
        "& ul": {
            marginRigth: theme.spacing(0)
        }
    }
}));

const renderGroup = params => [
    <ListSubheader key={params.key} component="div">
        {params.group}
    </ListSubheader>,
    params.children
];

const FilterMultipleSelect = React.memo(
    ({
        name = "Name Default",
        list = [],
        label = "Label Default",
        onChange = () => {},
        disabled = false,
        value = [],
        optionField = "name",
        required = false
    }) => {
        const classes = useStyles();

        return (
            <Autocomplete
                value={value}
                onChange={(_, newValue) => {
                    onChange({
                        target: {
                            name: name,
                            value: newValue
                        }
                    });
                }}
                disableListWrap
                disableCloseOnSelect
                disabled={disabled}
                multiple
                fullWidth
                classes={classes}
                ListboxComponent={ListboxComponent}
                renderGroup={renderGroup}
                options={list}
                renderInput={params => (
                    <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        label={label}
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: "off",
                            required: value.length === 0
                        }}
                        required={required}
                    />
                )}
                getOptionLabel={option =>
                    option !== undefined && option[optionField]
                }
                getOptionSelected={(option, value) => option.id === value.id}
                renderOption={(option, { selected }) => (
                    <FormControlLabel
                        label={option[optionField]}
                        style={{
                            width: "100%",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis"
                        }}
                        control={
                            <Checkbox color="primary" checked={selected} />
                        }
                    />
                )}
            />
        );
    }
);

export default FilterMultipleSelect;
