import { useState } from 'react';
import { useGetFeedback } from 'src/actions/feedback/useGetFeedback';
import { TableHeadCellProps } from 'src/components';
import { FeedbackRequest, FeedbackTableFormated } from 'src/interfaces/feedback/feedback-list';

export function useFeedbackList() {
  const [sendFilter, setSendFilter] = useState<FeedbackRequest>({});
  const { reviews, isError, isLoading } = useGetFeedback(sendFilter);
  const dataTableFormated: FeedbackTableFormated[] = [];

  reviews?.feedbackListAdapter.forEach((item) => {
    dataTableFormated.push({
      created_at: item.created_at,
      image: item.image,
      nickname: item.nickname,
      price: item.ratings_breakdown.filter((rating) => rating.name === 'Price')[0]?.value || 'N/A',
      value: item.ratings_breakdown.filter((rating) => rating.name === 'Value')[0]?.value || 'N/A',
      quality:
        item.ratings_breakdown.filter((rating) => rating.name === 'Quality')[0]?.value || 'N/A',
      name: item.name,
      sku: item.sku,
      status: item.status,
      text: item.text,
      sumary: item.summary,
    });
  });
  const handleFilterClick = (rating: string = '4') => {
    setSendFilter({ filter: { rating: { eq: rating } } });
  };
  const tableHead: TableHeadCellProps[] = [
    { id: 'sku', label: 'Sku', width: 150 },
    { id: 'image', label: 'Image', width: 150 },
    { id: 'name', label: 'name', width: 500 },
    { id: 'price', label: 'Price', width: 150 },
    { id: 'value', label: 'Value', width: 150 },
    { id: 'quality', label: 'Quality', width: 150 },
    { id: 'comment', label: 'Comment', width: 500 },
    { id: 'review', label: 'Review', width: 150 },
    { id: 'nickName', label: 'Customer', width: 250 },
    { id: 'status', label: 'Status', width: 150 },
    { id: 'created', label: 'Created', width: 150 },
  ];
  return {
    reviewsList: dataTableFormated,
    isError,
    isLoading,
    tableHead,
    handleFilterClick,
  };
}
