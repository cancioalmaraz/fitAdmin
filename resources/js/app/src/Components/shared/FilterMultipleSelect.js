import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { VariableSizeList } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFilters } from "../../actions/filter";
import { Checkbox, FormControlLabel } from "@material-ui/core";

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

const ImageManagerFilter = React.memo(
    ({ name, list, label, module = "ImageManager" }) => {
        const classes = useStyles();
        const [selecteds, setSelecteds] = useState(
            useSelector(state => state.filters[module].selectedFilters[name])
        );
        const { loadingFilters } = useSelector(
            state => state.filters.filterList
        );
        const dispatch = useDispatch();

        const handleChange = (_, newValue) => {
            dispatch(setSelectedFilters(name, newValue, module));
            setSelecteds(newValue);
        };

        return (
            <Autocomplete
                id={`label-${name}`}
                value={selecteds}
                onChange={handleChange}
                disableListWrap
                disabled={loadingFilters}
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
                    />
                )}
                getOptionLabel={option => option !== undefined && option.name}
                renderOption={(option, { selected }) => (
                    <FormControlLabel
                        label={option.name}
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
                renderTags={value => value.map(e => e.name).join(", ")}
            />
        );
    }
);

export default ImageManagerFilter;
