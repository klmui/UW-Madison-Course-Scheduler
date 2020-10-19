class SearchAndFilter {
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits, interestArea) {
    if(subject !== '' && search !== null) {
      let coursesAfterSearch = [];

      for(const course of courses) {
        for(const keyword of course.keywords)
        {
          if (interestArea === "Any") {
            if (keyword.includes(search)) {
              coursesAfterSearch.push(course);
              break;
            }
          } else {
            if (keyword.includes(search) && keyword === interestArea) {
              coursesAfterSearch.push(course);
              break;
            }
          }
        } 
      }
      courses = coursesAfterSearch;
    }


    if (subject !== 'All') {
      let coursesAfterSubject = [];

      for(const course of courses) { 
        if (course.subject === subject) {
          coursesAfterSubject.push(course);
        }
      }
      courses = coursesAfterSubject;
    }

    if(minimumCredits !== '') {
      let coursesAfterMinimumCredits = [];

      for(const course of courses) { 
        if(course.credits >= parseInt(minimumCredits))
          coursesAfterMinimumCredits.push(course);
      }
      courses = coursesAfterMinimumCredits;
    }

    if(maximumCredits !== '') {
      let coursesAfterMaximumCredits = [];

      for(const course of courses) { 
        if(course.credits <= parseInt(maximumCredits))
          coursesAfterMaximumCredits.push(course);
      }
      courses = coursesAfterMaximumCredits;
    }

    return courses;
  }
}

export default SearchAndFilter;
