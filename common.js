// side.htmlを読み込む
fetch('side.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('sidebar-container').innerHTML = html;
        highlightCurrentPage();
    });

// 現在のページをハイライト
function highlightCurrentPage(){
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('aside a').forEach(link => {
        if(link.getAttribute('href') === currentPage){
            link.classList.add('active');
        }
    });
}