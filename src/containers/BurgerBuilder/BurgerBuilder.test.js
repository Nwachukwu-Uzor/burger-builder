import React from 'react';

import { configure, shallow } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()})

import { BurgerBuilder} from "./BurgerBuilder";
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
describe('<BurgerBuilder />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}/>)
    })

    it('should render <buildControl /> when receiving ingredients', () => {
        wrapper.setProps({ings: {salad: 0}})
        expect(wrapper.find(BuildControls)).toHaveLength(1)
    })
})