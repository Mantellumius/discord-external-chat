import { chatActions, selectChannelId, selectMessages } from '@entities/Chat';
import { Message as MessageType } from '@entities/Chat/model/types/Message';
import { selectToken } from '@entities/User';
import { DISCORD_API } from '@shared/consts/apis';
import classNames from '@shared/lib/classNames/classNames';
import { Message } from '@widgets/Message';
import axios from 'axios';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cls from './Messages.module.scss';

export const Messages: FC<Props> = ({ className }) => {
	const dispatch = useDispatch();
	const messages = useSelector(selectMessages);
	const channelId = useSelector(selectChannelId);
	const token = useSelector(selectToken);
	const ref = useRef<HTMLLIElement | null>(null);
	useEffect(() => {
		const interval = setInterval(async () => {
			if (!token || !channelId) return;
			const response = await axios.get<MessageType[]>(`${DISCORD_API}/channels/${channelId}/messages?limit=10`, {
				headers: {
					'Authorization': token
				}
			});
			dispatch(chatActions.setMessages(response.data.reverse()));
			ref.current?.scrollTo(0, ref.current.scrollHeight);
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [channelId, dispatch, token]);
	
	return (
		<li className={classNames(cls.root, {}, [className])} 
			ref={ref}
		>
			{messages.map(message => (
				<Message key={message.id} message={message} />
			))}
		</li>
	);
};

interface Props {
	className?: string,
}