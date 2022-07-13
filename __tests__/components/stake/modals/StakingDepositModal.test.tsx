// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    StakingDepositModal,
    IStakingDepositModalProps,
} from '../../../../src/components/stake/modals/StakingDepositModal';
import { withChakraTheme } from '../../../test-utilities';
import { BigNumber } from 'ethers';

const defaultValue = '100000000000000000000000';

const defaultProps = {
    allowance: BigNumber.from(defaultValue),
    balance: BigNumber.from(defaultValue),
    disclosure: {
        onClose: () => undefined,
    },
    isOpen: true,
    onClose: () => undefined,
    onSave: () => undefined,
};

const EStakingDepositModal =
    withChakraTheme<IStakingDepositModalProps>(StakingDepositModal);

describe('Staking Deposit Modal', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EStakingDepositModal {...defaultProps} />);

    it('Should display allowance label when allowance is zero', () => {
        render(
            <EStakingDepositModal
                {...defaultProps}
                allowance={BigNumber.from(0)}
            />
        );

        expect(
            screen.getByText('Set Allowance and Deposit')
        ).toBeInTheDocument();
    });

    it('Should display deposit label when allowance is above zero', () => {
        renderComponent();
        expect(
            screen.getByText(
                'You can deposit any amount of token to the pool as far as you have the tokens amount is lower than the set allowance. As a safety precaution, the average waiting time is 6 hours.'
            )
        ).toBeInTheDocument();
    });

    it('Should not display modal when closed', () => {
        render(<EStakingDepositModal {...defaultProps} isOpen={false} />);

        expect(() => screen.getByText('Set Allowance and Deposit')).toThrow(
            'Unable to find an element'
        );
    });

    it('Should invoke onClose callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EStakingDepositModal {...defaultProps} onClose={mockOnClick()} />
        );

        const button = getByText('Cancel').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('Should invoke onSave callback', () => {
        const mockOnClick = jest.fn();
        const { getByRole } = render(
            <EStakingDepositModal {...defaultProps} onSave={mockOnClick()} />
        );

        const button = getByRole('deposit-button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
