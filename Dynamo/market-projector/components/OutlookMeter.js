function getToRotateFromValue(value){
	const valueToConsider = Math.max(Math.min(value, 100), 0);

	return 180 * valueToConsider / 100
}

export default function OutlookMeter({ value, ...props }) {
	return <div { ...props }>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 101" fill="none" {...props}>
			<path d="M165 93.5C165 54.0116 132.988 22 93.5 22C54.0116 22 22 54.0116 22 93.5" stroke="#CFE0F7" strokeWidth="43" />
			<path d="M165 93.5C165 54.0116 132.988 22 93.5 22C70.0318 22 49.2044 33.3065 36.1679 50.7694" stroke="#9FC1EF" strokeWidth="43" />
			<path d="M165 93.5C165 54.0116 132.988 22 93.5 22C85.7074 22 78.2061 23.2466 71.1844 25.5513" stroke="#6DA3E6" strokeWidth="43" />
			<path d="M165 93.5C165 61.6673 144.197 34.6932 115.445 25.4308" stroke="#3E84DF" strokeWidth="43" />
			<path d="M165 93.5C165 77.425 159.695 62.589 150.741 50.6471" stroke="#0D65D7" strokeWidth="43" />
			<path d="M100.308 88.1579C100.271 84.5683 97.3317 81.6881 93.742 81.7248C90.1524 81.7615 87.2721 84.7013 87.3089 88.291C87.3456 91.8806 90.2854 94.7609 93.8751 94.7241C97.4647 94.6874 100.345 91.7476 100.308 88.1579Z" fill="url(#paint0_linear)" stroke="#1A2C51" stroke-width="4" />
			<path
					fillRule="evenodd" clipRule="evenodd"
					d="M28.312 88.8948L88.2525 82.781L88.3651 93.7805L28.312 88.8948Z"
					fill="#1D2C4F"
					style={{ transformOrigin: "50% 87%", transform: `rotate(${getToRotateFromValue(value)}deg)`}}
			/>
			<defs>
				<linearGradient id="paint0_linear" x1="87.3089" y1="88.291" x2="100.308" y2="88.1579" gradientUnits="userSpaceOnUse">
					<stop stopColor="#899ED6" />
					<stop offset="1" stopColor="#141D31" />
				</linearGradient>
			</defs>
		</svg>
		<p className="m-0 text-center">{value}</p>
	</div>;
}