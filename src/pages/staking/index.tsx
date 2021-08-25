// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
    Flex,
    Box,
    Text,
    Button,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FaCoins } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import { AiOutlineDollar } from 'react-icons/ai';

import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import useUser from '../../graphql/hooks/useUser';
import Layout from '../../components/Layout';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import Node from '../../components/staking/Node';
import Balances from '../../components/staking/Balances';
import StakingTabs from '../../components/staking/Tabs';
import TotalBalances from '../../components/staking/TotalBalances';
import UnstakeForm from '../../components/staking/UnstakeForm';
import StakeForm from '../../components/staking/StakeForm';
import useSummary from '../../graphql/hooks/useSummary';
import TransactionFeedback from '../../components/TransactionFeedback';
import CTSIText from '../../components/CTSIText';
import { useTimeLeft } from '../../utils/react';

const Staking = () => {
    const { account } = useWeb3React<Web3Provider>();
    const blockNumber = useBlockNumber();

    const {
        staking,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        transaction: stakingTransaction,
        withdraw,
        stake,
        unstake,
    } = useStaking(account);

    const {
        allowance,
        approve,
        balance,
        transaction: tokenTransaction,
    } = useCartesiToken(account, staking?.address, blockNumber);

    const summary = useSummary();
    const user = useUser(account);

    const [nodeWaiting, setNodeWaiting] = useState<boolean>(false);

    const waiting =
        stakingTransaction.submitting ||
        tokenTransaction.submitting ||
        nodeWaiting;

    // countdown timers for maturation and release
    const maturingLeft = useTimeLeft(maturingTimestamp?.getTime());
    const releasingLeft = useTimeLeft(releasingTimestamp?.getTime());

    const totalBalance = stakedBalance
        .add(maturingBalance)
        .add(releasingBalance);

    // dark mode support
    const bg = useColorModeValue('white', 'gray.700');

    return (
        <Layout>
            <Head>
                <title>Cartesi - Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Balances balance={balance} stakedBalance={stakedBalance} />
            <Node setWaiting={setNodeWaiting} mt="-2.5vw" />

            <VStack p="20px 6vw 20px 6vw">
                <StakingDisclaimer persistanceKey="readDisclaimer" />
                <TransactionFeedback transaction={tokenTransaction} />
                <TransactionFeedback transaction={stakingTransaction} />
            </VStack>

            <TotalBalances
                p="25px 6vw 0 6vw"
                justify="flex-start"
                spacing={100}
                totalReward={BigNumber.from(user?.totalReward || 0)}
                totalBalance={totalBalance}
            />

            <Flex
                direction={['column', 'column', 'column', 'row']}
                p="50px 6vw 50px 6vw"
            >
                <Box flex="3" pr={[0, 0, 0, 8]} mb={[8, 8, 8, 0]}>
                    <Box
                        mb={8}
                        boxShadow="lg"
                        borderLeft="10px solid black"
                        bg={bg}
                    >
                        <CTSIText
                            p={6}
                            value={maturingBalance}
                            icon={BsClockHistory}
                            direction="row"
                        >
                            <Text>Maturing</Text>
                            {maturingBalance.gt(0) && maturingLeft && (
                                <Text fontSize="sm">
                                    {maturingLeft} to mature
                                </Text>
                            )}
                        </CTSIText>
                        <CTSIText
                            p={6}
                            value={stakedBalance}
                            icon={FaCoins}
                            direction="row"
                        >
                            <Text>Staked</Text>
                        </CTSIText>
                    </Box>

                    <Box
                        mb={8}
                        boxShadow="lg"
                        borderLeft="10px solid black"
                        bg={bg}
                    >
                        <CTSIText
                            p={6}
                            value={releasingBalance}
                            icon={AiOutlineDollar}
                            direction="row"
                        >
                            {releasingLeft && <Text>Releasing</Text>}
                            {!releasingLeft && <Text>Released</Text>}
                            {releasingBalance.gt(0) && releasingLeft && (
                                <Text fontSize="sm">
                                    {releasingLeft} to release
                                </Text>
                            )}
                            {releasingBalance.gt(0) && !releasingLeft && (
                                <Button
                                    size="sm"
                                    disabled={!account || waiting}
                                    onClick={() => withdraw(releasingBalance)}
                                >
                                    Withdraw
                                </Button>
                            )}
                        </CTSIText>
                    </Box>
                </Box>

                <StakingTabs
                    flex={2}
                    bg={bg}
                    Stake={
                        <StakeForm
                            allowance={allowance}
                            releasing={releasingBalance}
                            totalStaked={BigNumber.from(
                                summary?.totalStaked || '0'
                            )}
                            disabled={!account || waiting}
                            onApprove={(amount) =>
                                approve(staking.address, amount)
                            }
                            onStake={stake}
                        />
                    }
                    Unstake={
                        <UnstakeForm
                            maturing={maturingBalance}
                            staked={stakedBalance}
                            onUnstake={unstake}
                            disabled={!account || waiting}
                        />
                    }
                />
            </Flex>
        </Layout>
    );
};

export default Staking;
