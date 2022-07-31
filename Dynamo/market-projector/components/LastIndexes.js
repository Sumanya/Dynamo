export function LastIndexes({ lastIndexes }) {
    return <div className="d-flex justify-content-between px-4 font-weight-bold flex-wrap">
      {
        lastIndexes.map((index) => <div>
          <div className="text-muted">{ index.label }</div>
          <div style={{ color: index.color }}>{ index.tag }</div>
        </div>)
      }
    </div>
  }
  