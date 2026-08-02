function DashboardCard({
    title,
    value,
    icon,
    color
}){

return(

<div className="col-lg-3 col-md-6 mb-4">

<div className="card shadow border-0">

<div className="card-body d-flex justify-content-between align-items-center">

<div>

<h6 className="text-muted">
{title}
</h6>

<h2 className="fw-bold">
{value}
</h2>

</div>

<i
className={`${icon} fs-1 text-${color}`}
></i>

</div>

</div>

</div>

)

}

export default DashboardCard;