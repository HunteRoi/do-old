import { Checkbox } from '@mui/material';
import { ChoiceStatus, ChoiceStatusEnum } from '../models';

type ThreeStateCheckboxProps = {
    state?: ChoiceStatus;
};

const ThreeStateCheckbox: React.FC<ThreeStateCheckboxProps> = ({ state }) => {
    switch (state) {
        case ChoiceStatusEnum.GOING:
            return <Checkbox disabled checked sx={{ color: 'green',  '&.Mui-checked': { color: 'green' } }}/>;
        case ChoiceStatusEnum.MAYBE:
            return <Checkbox disabled indeterminate sx={{ color: 'orange', '&.MuiCheckbox-indeterminate': { color: 'orange' } }}/>;

        case null: case undefined: default:
            return <Checkbox disabled />;
    }
};

export default ThreeStateCheckbox;
