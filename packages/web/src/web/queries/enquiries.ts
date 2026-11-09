import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orpc } from '../lib/api';
export function useCreateEnquiry() { return useMutation(orpc.enquiries.create.mutationOptions()); }
export function useEnquiries(enabled = true, ownerId = '') {
  const options = orpc.enquiries.list.queryOptions({ enabled, retry: false });
  return useQuery({ ...options, queryKey: [...options.queryKey, ownerId] });
}
export function useUpdateEnquiry() {
  const qc = useQueryClient();
  return useMutation(orpc.enquiries.update.mutationOptions({ onSuccess: () => qc.invalidateQueries({ queryKey: orpc.enquiries.key() }) }));
}