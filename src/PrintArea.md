```jsx
<PrintArea title="Print Demo" className="container" printMode="popup">
    <img src="https://mpng.subpng.com/20190719/hho/kisspng-favicon-computer-icons-portable-network-graphics-w-free-png-website-icons-konfest-5d31c3a697a7a9.3682417315635424386212.jpg" style={{width: '60px'}}/>
    <PrintHeader>
        <div className="print-header">
            <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/print-512.png" style={{width: '60px'}}/>
            <div className="print-header">
            </div>
        </div>
    </PrintHeader>
    <div style={{display: 'none'}}>
        <PrintSection className="text-success">
            <i className="fa fa-check-square-o" style={{fontSize: '5em'}}/>
        </PrintSection>
    </div>
    <PrintSection className="text-warning">
        Not nested section
    </PrintSection>
    <PrintSection className="row">
        <p className="col-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at
            hendrerit lorem. Sed dolor arcu, vehicula in sodales vitae, lacinia eu elit. Nulla
            egestas, risus mollis interdum elementum, dolor ex tincidunt lectus, vel laoreet ligula
            augue nec magna. Nam consectetur, lorem et dictum porta, nisl elit vulputate felis, ac
            ornare est justo pharetra lacus. Phasellus pellentesque non tellus eget pellentesque.
            Vestibulum elit tortor, dapibus quis fermentum ut, lacinia vel libero. Praesent massa
            enim, imperdiet sit amet erat at, ultrices interdum metus. Aenean ultricies eros id nibh
            consectetur, malesuada aliquet quam ultricies. Nullam vitae lectus purus. Praesent in sem
            pretium, laoreet velit nec, eleifend dolor. Curabitur non ipsum nec odio pharetra lobortis
            a non mauris.</p>
        <PrintSection className="col-6"><p>Nunc faucibus ante a nunc dignissim vehicula. Integer a
            eleifend velit. Curabitur dictum, dolor at cursus fermentum, lacus lacus lacinia odio, sit
            amet volutpat nibh ex a nulla. Sed iaculis eleifend faucibus. Curabitur vestibulum
            lobortis odio, nec gravida nulla cursus vitae. Curabitur molestie nisl sodales lacus
            varius, eu ultricies nulla vehicula. Fusce quam est, fringilla id maximus sit amet,
            fermentum nec leo. Vivamus mattis diam at massa sagittis tristique. Morbi in pharetra
            metus, vel blandit ipsum. Mauris dapibus sagittis ipsum, a viverra lectus pulvinar ac.</p>
        </PrintSection>
        <p className="col-6">Aliquam erat volutpat. Vivamus sed diam eu ligula cursus luctus. In
            cursus tortor in felis mollis rutrum vitae in arcu. Nulla vitae elit diam. Etiam consequat
            neque sed condimentum facilisis. Aenean non quam laoreet purus hendrerit molestie. Integer
            finibus, erat eget hendrerit efficitur, urna nulla vulputate magna, vitae auctor massa sem
            id nisl. Pellentesque fermentum libero a dui ullamcorper, non luctus leo pretium. Ut in
            erat nec felis sollicitudin ornare nec nec lorem. Integer placerat augue in arcu porttitor
            tempor. Morbi accumsan eros non eleifend rutrum.</p>
        <PrintSection priority={1} className="col-6"><p>Donec fermentum mollis purus, a mattis
            ligula viverra et. Pellentesque tellus tortor, rhoncus sit amet purus eget, aliquam luctus
            nulla. Quisque vulputate augue id enim sollicitudin, a euismod nibh condimentum. Phasellus
            placerat risus at rutrum consequat. Morbi congue tristique sapien eu facilisis. Proin
            lacinia leo at tortor interdum vestibulum. Suspendisse sit amet consectetur tortor, eget
            faucibus est. Vestibulum massa libero, consectetur vel nunc ac, aliquam ullamcorper ante.
            Interdum et malesuada fames ac ante ipsum primis in faucibus. </p></PrintSection>
        <p className="col-6">Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam sed
            efficitur nisi, eu hendrerit purus. Integer et euismod arcu. Pellentesque id ultricies
            metus. Morbi aliquet orci ut aliquam auctor. Pellentesque sed urna non urna ultrices
            scelerisque vitae non magna. Aenean vitae tortor viverra, vehicula tortor vel, maximus
            nulla. Sed semper condimentum lorem a fringilla. Duis at odio sodales, suscipit enim quis,
            commodo erat. Vestibulum est ante, porta quis sagittis quis, fermentum eget augue. Morbi
            quis egestas risus.</p>
    </PrintSection>
    <PrintTrigger className="col-6">
        <button>Print</button>
    </PrintTrigger>
</PrintArea>
```