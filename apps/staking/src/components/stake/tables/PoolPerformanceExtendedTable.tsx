// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useRef } from 'react';
import {
    Table,
    Tbody,
    Td,
    Text,
    Tr,
    Th,
    Thead,
    HStack,
    Spinner,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { GhostButton } from '@explorer/ui';
import {
    StakingPoolFlat,
    StakingPoolSortExtended,
} from '../../../graphql/models';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import PoolPerformanceExtendedTableRow from './PoolPerformanceExtendedTableRow';
import { useVisibilityThreshold } from '../../../utils/hooks/useVisibilityThreshold';
import { SlideInOut } from '../../animation/SlideInOut';

export interface PoolPerformanceExtendedTableProps {
    chainId: number;
    account?: string;
    loading: boolean;
    data?: StakingPoolFlat[];
    sort?: StakingPoolSortExtended;
    onSort: (order: StakingPoolSortExtended) => void;
}

const SortIcon = () => <ArrowDownIcon data-testid="sort-icon" />;

const PoolPerformanceExtendedTable: FC<PoolPerformanceExtendedTableProps> = ({
    chainId,
    data,
    loading,
    sort,
    onSort,
}) => {
    const stakeText = useBreakpointValue(['Info', 'Info', 'Stake/Info']);
    const hasItems = data?.length > 0;
    const thRef = useRef<HTMLTableCellElement>();
    const tableRef = useRef<HTMLDivElement>();
    const threshold = useVisibilityThreshold(tableRef.current, thRef.current);
    const borderColor = useColorModeValue('white', 'gray.700');

    return (
        <TableResponsiveHolder ref={tableRef}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Pool Address</Th>

                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('totalUsers')}
                            >
                                Total Users
                            </GhostButton>
                            {sort === 'totalUsers' && <SortIcon />}
                        </Th>

                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('amount')}
                            >
                                Total Staked
                            </GhostButton>
                            {sort === 'amount' && <SortIcon />}
                        </Th>

                        <Th isNumeric whiteSpace="nowrap">
                            Total Rewards
                        </Th>

                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('weekPerformance')}
                            >
                                <Text whiteSpace="nowrap">7-days %</Text>{' '}
                                (annual)
                            </GhostButton>
                            {sort === 'weekPerformance' && <SortIcon />}
                        </Th>

                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('monthPerformance')}
                            >
                                <Text whiteSpace="nowrap">30-days %</Text>{' '}
                                (annual)
                            </GhostButton>
                            {sort === 'monthPerformance' && <SortIcon />}
                        </Th>

                        <Th isNumeric whiteSpace="nowrap">
                            Configured Commission
                        </Th>
                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('commissionPercentage')}
                            >
                                Accrued Commission
                            </GhostButton>{' '}
                            {sort === 'commissionPercentage' && <SortIcon />}
                        </Th>

                        <Th ref={thRef} isNumeric>
                            {stakeText}
                        </Th>

                        {threshold.isBelow && (
                            <Th
                                isNumeric
                                position="sticky"
                                top={0}
                                right={0}
                                minWidth={{ base: '80px', md: '127px' }}
                                height="73px"
                                padding={0}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                borderColor={borderColor}
                                borderBottomWidth={[0, '1px', 0, 0]}
                            >
                                <SlideInOut display={threshold.isBelow}>
                                    {stakeText}
                                </SlideInOut>
                            </Th>
                        )}
                    </Tr>
                </Thead>

                <Tbody>
                    {loading ? (
                        <Tr>
                            <Td colSpan={9} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Td>
                        </Tr>
                    ) : hasItems ? (
                        data.map((pool) => (
                            <PoolPerformanceExtendedTableRow
                                key={pool.id}
                                chainId={chainId}
                                pool={pool}
                                keepActionColVisible={threshold.isBelow}
                            />
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={9} textAlign="center">
                                <Text>No items</Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableResponsiveHolder>
    );
};

export default PoolPerformanceExtendedTable;
