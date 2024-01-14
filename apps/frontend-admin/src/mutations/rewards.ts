import { CreateRewardDto, RewardEntity, UpdateRewardDto } from '@shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api } from '../api/api';
import { rewardsKeys } from '../queries/rewards';

export const useUpdateRewardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RewardEntity, AxiosError, UpdateRewardDto, RewardEntity[]>(
    {
      mutationFn: api.updateReward,
      onMutate: async (data) => {
        await queryClient.cancelQueries(rewardsKeys.list);

        const prev = queryClient.getQueryData<RewardEntity[]>(
          rewardsKeys.list.queryKey
        );

        queryClient.setQueryData<UpdateRewardDto[]>(
          rewardsKeys.list.queryKey,
          (rewards) =>
            (rewards ?? []).map((reward) =>
              reward.id === data.id ? { ...reward, ...data } : reward
            )
        );

        return prev;
      },
      onError: (_err, _commands, context) => {
        queryClient.setQueryData<UpdateRewardDto[]>(
          rewardsKeys.list.queryKey,
          context ?? []
        );
      },
    }
  );
};

export const useCreateRewardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RewardEntity, AxiosError, CreateRewardDto, RewardEntity[]>(
    {
      mutationFn: api.createReward,
      onMutate: async (data) => {
        await queryClient.cancelQueries({ ...rewardsKeys.list });

        const prev = queryClient.getQueryData<RewardEntity[]>(
          rewardsKeys.list.queryKey
        );

        queryClient.setQueryData<CreateRewardDto[]>(
          rewardsKeys.list.queryKey,
          (rewards) => [...(rewards ?? []), data]
        );

        return prev;
      },
      onSuccess: (data, variables) => {
        queryClient.setQueryData<RewardEntity[]>(
          rewardsKeys.list.queryKey,
          (rewards) =>
            (rewards ?? []).map((reward) =>
              reward === variables ? { ...reward, ...data } : reward
            )
        );
      },
      onError: (_err, _commands, context) => {
        queryClient.setQueryData<CreateRewardDto[]>(
          rewardsKeys.list.queryKey,
          context ?? []
        );
      },
    }
  );
};
