import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class JobProposalHelper {
  getStars(rating: number): string[] {
    const normalizedRating = Math.min(Math.max(rating, 0), 5);

    const fullStars = Math.floor(normalizedRating);                  // Full stars (integer part)
    const hasHalfStar = normalizedRating % 1 >= 0.5 ? 'star_half' : ''; // Half star if applicable
    const emptyStars = 5 - Math.ceil(normalizedRating);              // Remaining empty stars

    const stars = Array(fullStars).fill('star');                     // Full stars array

    if (hasHalfStar) {
      stars.push(hasHalfStar);                                       // Add half star if needed
    }

    stars.push(...Array(emptyStars).fill('star_border'));            // Fill the rest with empty stars

    return stars;
  }


}
