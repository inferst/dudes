import { CreateTwitchRewardDto, RewardEntity, UpdateTwitchRewardDto } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api } from '../api/api';
import { rewardsKeys } from '../queries/rewards';

export const useUpdateRewardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RewardEntity, AxiosError, UpdateTwitchRewardDto, RewardEntity[]>(
    {
      mutationFn: api.updateReward,
      onMutate: async (data) => {
        await queryClient.cancelQueries(rewardsKeys.list);

        const prev = queryClient.getQueryData<RewardEntity[]>(
          rewardsKeys.list.queryKey
        );

        queryClient.setQueryData<UpdateTwitchRewardDto[]>(
          rewardsKeys.list.queryKey,
          (rewards) =>
            (rewards ?? []).map((reward) =>
              reward.id === data.id ? { ...reward, ...data } : reward
            )
        );

        return prev;
      },
      onError: (_err, _commands, context) => {
        queryClient.setQueryData<UpdateTwitchRewardDto[]>(
          rewardsKeys.list.queryKey,
          context ?? []
        );
      },
    }
  );
};

export const useCreateRewardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RewardEntity, AxiosError, CreateTwitchRewardDto, RewardEntity[]>(
    {
      mutationFn: api.createReward,
      onSuccess: (data) => {
        queryClient.setQueryData<RewardEntity[]>(
          rewardsKeys.list.queryKey,
          (rewards) => [...(rewards ?? []), data]
        );
      },
    }
  );
};

export const useDeleteRewardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RewardEntity, AxiosError, number, RewardEntity[]>({
    mutationFn: api.deleteReward,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ ...rewardsKeys.list });

      const prev = queryClient.getQueryData<RewardEntity[]>(
        rewardsKeys.list.queryKey
      );

      queryClient.setQueryData<RewardEntity[]>(
        rewardsKeys.list.queryKey,
        (rewards) => (rewards ?? []).filter((reward) => reward.id !== id)
      );

      return prev;
    },
    onError: (_err, _commands, context) => {
      queryClient.setQueryData<RewardEntity[]>(
        rewardsKeys.list.queryKey,
        context ?? []
      );
    },
  });
};
