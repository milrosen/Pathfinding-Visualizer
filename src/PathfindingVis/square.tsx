import React, { useEffect } from 'react';
import { gridSquareState } from './namespace';

export default function Square({ type, handleMouseOver, index, handleClick }: { type: gridSquareState, handleMouseOver: (index: number) => void, index: number, handleClick: (index: number) => void }): JSX.Element {
	const ref = React.createRef<HTMLDivElement>();

	useEffect(() => {
		ref.current?.addEventListener('mouseenter', () => handleMouseOver(index));
		ref.current?.addEventListener('mousedown', () => handleClick(index));
	}, []);

	return (
		<div className='square' ref={ref}>
			<div className={`${type} default`} id={`${index}`}></div>
		</div>
	);
}
