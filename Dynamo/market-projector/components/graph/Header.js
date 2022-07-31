import {Link} from 'react-router-dom';
import {Button, Tooltip} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';

export default function Header() {
	return <header className="mb-1">
		<Link to="/">
			<Tooltip title="Go back">
				<Button size="large" shape="circle">
					<div className="d-flex justify-content-center align-items-center">
						<ArrowLeftOutlined/>
					</div>
				</Button>
			</Tooltip>
		</Link>
	</header>
}
